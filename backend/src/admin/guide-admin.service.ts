import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';
import { CreateGuideCategoryDto } from './dto/create-guide-category.dto';
import { UpdateGuideCategoryDto } from './dto/update-guide-category.dto';
import { CreateGuideItemDto } from './dto/create-guide-item.dto';
import { UpdateGuideItemDto } from './dto/update-guide-item.dto';
import { QueryGuideItemsDto } from './dto/query-guide-items.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class GuideAdminService {
  constructor(
    @InjectRepository(GuideCategory)
    private readonly guideCategoryRepository: Repository<GuideCategory>,
    @InjectRepository(GuideItem)
    private readonly guideItemRepository: Repository<GuideItem>,
  ) {}

  private mapGuideCategory(cat: GuideCategory) {
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id ?? null,
      parent: cat.parent
        ? { id: cat.parent.id, name: cat.parent.name }
        : null,
      children: cat.children
        ? cat.children.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: c.icon ?? null,
            color: c.color ?? null,
            display_order: c.display_order,
            is_active: c.is_active,
            created_at: c.created_at,
          }))
        : [],
      icon: cat.icon ?? null,
      color: cat.color ?? null,
      display_order: cat.display_order,
      is_active: cat.is_active,
      created_at: cat.created_at,
    };
  }

  private mapGuideItem(item: GuideItem) {
    return {
      id: item.id,
      category_id: item.category_id,
      category: item.category
        ? {
            id: item.category.id,
            name: item.category.name,
            parent: item.category.parent
              ? { id: item.category.parent.id, name: item.category.parent.name }
              : null,
          }
        : null,
      name: item.name,
      phone: item.phone,
      address: item.address ?? null,
      email: item.email ?? null,
      website_url: item.website_url ?? null,
      working_hours: item.working_hours ?? null,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      logo_file_id: item.logo_file_id ?? null,
      description: item.description ?? null,
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }

  private async generateGuideSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await this.guideCategoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    return slug;
  }

  async getGuideCategories() {
    const categories = await this.guideCategoryRepository.find({
      relations: ['parent', 'children'],
      order: { display_order: 'ASC', name: 'ASC' },
    });

    const roots = categories.filter((c) => !c.parent_id);

    return {
      categories: roots.map((cat) => this.mapGuideCategory(cat)),
    };
  }

  async createGuideCategory(dto: CreateGuideCategoryDto) {
    if (dto.parent_id) {
      const parent = await this.guideCategoryRepository.findOne({
        where: { id: dto.parent_id },
      });
      if (!parent) throw new BadRequestException('Üst kategori bulunamadı');
      if (parent.parent_id) {
        throw new BadRequestException('Maksimum 2 seviye hiyerarşi desteklenir');
      }
    }

    const slug = await this.generateGuideSlug(dto.name);

    const category = this.guideCategoryRepository.create({
      name: dto.name,
      slug,
      parent_id: dto.parent_id,
      icon: dto.icon,
      color: dto.color,
      display_order: dto.display_order ?? 0,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.guideCategoryRepository.save(category);

    const full = await this.guideCategoryRepository.findOne({
      where: { id: saved.id },
      relations: ['parent', 'children'],
    });

    return { category: this.mapGuideCategory(full!) };
  }

  async updateGuideCategory(id: string, dto: UpdateGuideCategoryDto) {
    const category = await this.guideCategoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    if (dto.parent_id !== undefined) {
      if (dto.parent_id === id) {
        throw new BadRequestException('Kategori kendisinin üst kategorisi olamaz');
      }
      if (dto.parent_id) {
        const parent = await this.guideCategoryRepository.findOne({
          where: { id: dto.parent_id },
        });
        if (!parent) throw new BadRequestException('Üst kategori bulunamadı');
        if (parent.parent_id) {
          throw new BadRequestException('Maksimum 2 seviye hiyerarşi desteklenir');
        }
      }
    }

    const fields: (keyof UpdateGuideCategoryDto)[] = [
      'name', 'parent_id', 'icon', 'color', 'display_order', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (category as any)[field] = dto[field];
      }
    }

    await this.guideCategoryRepository.save(category);

    const updated = await this.guideCategoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    return { category: this.mapGuideCategory(updated!) };
  }

  async deleteGuideCategory(id: string) {
    const category = await this.guideCategoryRepository.findOne({
      where: { id },
      relations: ['children', 'items'],
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        'Alt kategorileri olan bir kategori silinemez. Önce alt kategorileri silin.',
      );
    }

    if (category.items && category.items.length > 0) {
      throw new BadRequestException(
        'İçerik bulunan kategori silinemez. Önce içerikleri silin veya taşıyın.',
      );
    }

    await this.guideCategoryRepository.delete(id);
  }

  async getGuideItems(dto: QueryGuideItemsDto) {
    const { search, category_id, is_active, page = 1, limit = 20 } = dto;

    const qb = this.guideItemRepository
      .createQueryBuilder('gi')
      .leftJoinAndSelect('gi.category', 'category')
      .leftJoinAndSelect('category.parent', 'parent');

    if (search) {
      qb.andWhere(
        '(gi.name ILIKE :search OR gi.phone ILIKE :search OR gi.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category_id) {
      qb.andWhere('gi.category_id = :category_id', { category_id });
    }

    if (is_active !== undefined) {
      qb.andWhere('gi.is_active = :is_active', { is_active });
    }

    qb.orderBy('gi.name', 'ASC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((item) => this.mapGuideItem(item)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async createGuideItem(dto: CreateGuideItemDto) {
    const category = await this.guideCategoryRepository.findOne({
      where: { id: dto.category_id },
    });
    if (!category) throw new BadRequestException('Kategori bulunamadı');

    const item = this.guideItemRepository.create({
      category_id: dto.category_id,
      name: dto.name,
      phone: dto.phone,
      address: dto.address,
      email: dto.email,
      website_url: dto.website_url,
      working_hours: dto.working_hours,
      latitude: dto.latitude,
      longitude: dto.longitude,
      logo_file_id: dto.logo_file_id,
      description: dto.description,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.guideItemRepository.save(item);

    const full = await this.guideItemRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'category.parent'],
    });

    return { item: this.mapGuideItem(full!) };
  }

  async updateGuideItem(id: string, dto: UpdateGuideItemDto) {
    const item = await this.guideItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('İçerik bulunamadı');

    if (dto.category_id !== undefined) {
      const category = await this.guideCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!category) throw new BadRequestException('Kategori bulunamadı');
    }

    const fields: (keyof UpdateGuideItemDto)[] = [
      'category_id', 'name', 'phone', 'address', 'email', 'website_url',
      'working_hours', 'latitude', 'longitude', 'logo_file_id', 'description', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (item as any)[field] = dto[field];
      }
    }

    await this.guideItemRepository.save(item);

    const updated = await this.guideItemRepository.findOne({
      where: { id },
      relations: ['category', 'category.parent'],
    });

    return { item: this.mapGuideItem(updated!) };
  }

  async deleteGuideItem(id: string) {
    const item = await this.guideItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('İçerik bulunamadı');
    await this.guideItemRepository.delete(id);
  }
}
