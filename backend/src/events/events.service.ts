import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventImage } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';
import { QueryEventDto } from './dto/query-event.dto';
import {
  getPaginationMeta,
  getPaginationOffset,
} from '../common/utils/pagination.util';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventCategory)
    private readonly categoryRepository: Repository<EventCategory>,
  ) {}

  // ── KATEGORİLER ───────────────────────────────────────────────────────────
  // Aktif kategoriler + her kategorideki yayınlanmış etkinlik sayısı

  async findCategories() {
    const categories = await this.categoryRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC' },
    });

    // Yayınlanmış etkinlik sayısını tek sorguda al (N+1 önleme)
    const counts = await this.eventRepository
      .createQueryBuilder('e')
      .select('e.category_id', 'category_id')
      .addSelect('COUNT(e.id)', 'count')
      .where('e.status = :status', { status: 'published' })
      .andWhere('e.deleted_at IS NULL')
      .groupBy('e.category_id')
      .getRawMany();

    const countMap = new Map(
      counts.map((c) => [c.category_id, parseInt(c.count, 10)]),
    );

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        events_count: countMap.get(cat.id) ?? 0,
      })),
    };
  }

  // ── ETKİNLİK LİSTESİ ──────────────────────────────────────────────────────
  // status=published, event_date >= TODAY, soft delete dahil değil

  async findAll(dto: QueryEventDto) {
    const {
      page = 1,
      limit = 20,
      category_id,
      city,
      start_date,
      end_date,
      is_free,
      is_local,
    } = dto;

    const today = new Date().toISOString().slice(0, 10);

    const qb = this.eventRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.category', 'category')
      .leftJoinAndSelect('e.cover_image', 'cover_image')
      .where('e.status = :status', { status: 'published' })
      .andWhere('e.event_date >= :today', { today })
      .andWhere('e.deleted_at IS NULL');

    if (category_id) {
      qb.andWhere('e.category_id = :category_id', { category_id });
    }

    if (city) {
      qb.andWhere('e.city = :city', { city });
    }

    if (start_date) {
      qb.andWhere('e.event_date >= :start_date', { start_date });
    }

    if (end_date) {
      qb.andWhere('e.event_date <= :end_date', { end_date });
    }

    if (is_free !== undefined) {
      qb.andWhere('e.is_free = :is_free', { is_free });
    }

    if (is_local !== undefined) {
      qb.andWhere('e.is_local = :is_local', { is_local });
    }

    qb.orderBy('e.event_date', 'ASC')
      .addOrderBy('e.event_time', 'ASC')
      .skip(getPaginationOffset(page, limit))
      .take(limit);

    const [events, total] = await qb.getManyAndCount();

    return { events, meta: getPaginationMeta(total, page, limit) };
  }

  // ── ETKİNLİK DETAYI ───────────────────────────────────────────────────────
  // Sadece published, tüm görseller dahil

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id, status: 'published' },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    if (!event) {
      throw new NotFoundException('Etkinlik bulunamadı');
    }

    return { event };
  }
}
