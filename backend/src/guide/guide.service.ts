import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';
import { QueryGuideDto } from './dto/query-guide.dto';

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(GuideCategory)
    private readonly categoryRepository: Repository<GuideCategory>,
    @InjectRepository(GuideItem)
    private readonly itemRepository: Repository<GuideItem>,
  ) {}

  // ── KATEGORİLER ───────────────────────────────────────────────────────────
  // Aktif kategoriler + her kategorideki kayıt sayısı (N+1 önleme: 2 sorgu)

  async findCategories() {
    const categories = await this.categoryRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC' },
    });

    // Aktif kayıtların kategori bazında sayısı
    const counts = await this.itemRepository
      .createQueryBuilder('gi')
      .select('gi.category_id', 'category_id')
      .addSelect('COUNT(gi.id)', 'count')
      .where('gi.is_active = :active', { active: true })
      .groupBy('gi.category_id')
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
        color: cat.color,
        items_count: countMap.get(cat.id) ?? 0,
      })),
    };
  }

  // ── REHBER KAYITLARI ──────────────────────────────────────────────────────
  // Aktif kayıtlar, kategori + parent dahil, opsiyonel filtreler

  async findAll(dto: QueryGuideDto) {
    const { category_id, search } = dto;

    const qb = this.itemRepository
      .createQueryBuilder('gi')
      .leftJoinAndSelect('gi.category', 'category')
      .leftJoinAndSelect('category.parent', 'parent')
      .where('gi.is_active = :active', { active: true })
      .orderBy('gi.name', 'ASC');

    if (category_id) {
      qb.andWhere('gi.category_id = :category_id', { category_id });
    }

    if (search) {
      qb.andWhere(
        '(gi.name ILIKE :search OR gi.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const items = await qb.getMany();

    return { items };
  }
}
