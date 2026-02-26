import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryAdminEventsDto } from './dto/query-admin-events.dto';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class EventAdminService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
  ) {}

  private mapEvent(event: Event) {
    return {
      id: event.id,
      title: event.title,
      description: event.description ?? null,
      category_id: event.category_id ?? null,
      category: event.category
        ? { id: event.category.id, name: event.category.name, icon: event.category.icon ?? null }
        : null,
      event_date: event.event_date,
      event_time: event.event_time,
      duration_minutes: event.duration_minutes ?? null,
      venue_name: event.venue_name ?? null,
      venue_address: event.venue_address ?? null,
      is_local: event.is_local,
      city: event.city ?? null,
      latitude: event.latitude ?? null,
      longitude: event.longitude ?? null,
      organizer: event.organizer ?? null,
      ticket_price: event.ticket_price ?? null,
      is_free: event.is_free,
      age_restriction: event.age_restriction ?? null,
      capacity: event.capacity ?? null,
      website_url: event.website_url ?? null,
      ticket_url: event.ticket_url ?? null,
      cover_image_id: event.cover_image_id ?? null,
      cover_image_url: (event.cover_image as any)?.url ?? null,
      status: event.status,
      images: event.images?.map((img) => ({
        id: img.id,
        file_id: img.file_id,
        url: (img.file as any)?.url ?? null,
        display_order: img.display_order,
      })) ?? [],
      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  }

  private generateEventSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .trim();
  }

  async getEventCategories() {
    const categories = await this.eventCategoryRepository.find({
      order: { display_order: 'ASC', name: 'ASC' },
    });
    return { categories };
  }

  async createEventCategory(dto: CreateEventCategoryDto) {
    const baseSlug = this.generateEventSlug(dto.name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.eventCategoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const category = this.eventCategoryRepository.create({
      name: dto.name,
      slug,
      icon: dto.icon,
      is_active: dto.is_active ?? true,
      display_order: dto.display_order ?? 0,
    });

    const saved = await this.eventCategoryRepository.save(category);
    return { category: saved };
  }

  async getAdminEvents(dto: QueryAdminEventsDto) {
    const {
      search,
      category_id,
      start_date,
      end_date,
      status,
      is_local,
      page = 1,
      limit = 20,
    } = dto;

    const qb = this.eventRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.category', 'category')
      .leftJoinAndSelect('e.cover_image', 'cover_image');

    if (search) {
      qb.andWhere(
        '(e.title ILIKE :search OR e.venue_name ILIKE :search OR e.organizer ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category_id) {
      qb.andWhere('e.category_id = :category_id', { category_id });
    }

    if (start_date) {
      qb.andWhere('e.event_date >= :start_date', { start_date });
    }

    if (end_date) {
      qb.andWhere('e.event_date <= :end_date', { end_date });
    }

    if (status) {
      qb.andWhere('e.status = :status', { status });
    }

    if (is_local === true) {
      qb.andWhere('e.is_local = TRUE');
    } else if (is_local === false) {
      qb.andWhere('e.is_local = FALSE');
    }

    qb.orderBy('e.event_date', 'ASC').addOrderBy('e.event_time', 'ASC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [events, total] = await qb.getManyAndCount();

    return {
      events: events.map((e) => this.mapEvent(e)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async getAdminEvent(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    if (!event) throw new NotFoundException('Etkinlik bulunamadı');

    return { event: this.mapEvent(event) };
  }

  async createEvent(dto: CreateEventDto, userId: string) {
    if (dto.category_id) {
      const cat = await this.eventCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const event = this.eventRepository.create({
      title: dto.title,
      description: dto.description,
      category_id: dto.category_id,
      event_date: dto.event_date,
      event_time: dto.event_time,
      duration_minutes: dto.duration_minutes,
      venue_name: dto.venue_name,
      venue_address: dto.venue_address,
      is_local: dto.is_local ?? true,
      city: dto.city,
      latitude: dto.latitude,
      longitude: dto.longitude,
      organizer: dto.organizer,
      ticket_price: dto.ticket_price,
      is_free: dto.is_free ?? true,
      age_restriction: dto.age_restriction,
      capacity: dto.capacity,
      website_url: dto.website_url,
      ticket_url: dto.ticket_url,
      cover_image_id: dto.cover_image_id,
      status: (dto.status as any) ?? 'published',
      created_by: userId,
    });

    const saved = await this.eventRepository.save(event);

    const full = await this.eventRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'cover_image'],
    });

    return { event: this.mapEvent(full!) };
  }

  async updateEvent(id: string, dto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Etkinlik bulunamadı');

    if (dto.category_id !== undefined && dto.category_id !== null) {
      const cat = await this.eventCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const fields: (keyof UpdateEventDto)[] = [
      'title', 'description', 'category_id', 'event_date', 'event_time',
      'duration_minutes', 'venue_name', 'venue_address', 'is_local', 'city',
      'latitude', 'longitude', 'organizer', 'ticket_price', 'is_free',
      'age_restriction', 'capacity', 'website_url', 'ticket_url',
      'cover_image_id', 'status',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (event as any)[field] = dto[field];
      }
    }

    await this.eventRepository.save(event);

    const updated = await this.eventRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { event: this.mapEvent(updated!) };
  }

  async deleteEvent(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Etkinlik bulunamadı');
    await this.eventRepository.softDelete(id);
  }
}
