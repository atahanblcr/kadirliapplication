import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, DeepPartial, MoreThan } from 'typeorm';
import { Ad } from '../database/entities/ad.entity';
import { AdImage } from '../database/entities/ad-image.entity';
import { AdFavorite } from '../database/entities/ad-favorite.entity';
import { AdExtension } from '../database/entities/ad-extension.entity';
import { AdCategory } from '../database/entities/ad-category.entity';
import { AdPropertyValue } from '../database/entities/ad-property-value.entity';
import { CategoryProperty } from '../database/entities/category-property.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { QueryAdDto, QueryMyAdsDto } from './dto/query-ad.dto';
import { ExtendAdDto } from './dto/extend-ad.dto';
import { getPaginationMeta, getPaginationOffset } from '../common/utils/pagination.util';

@Injectable()
export class AdsService {
  private readonly logger = new Logger(AdsService.name);

  constructor(
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(AdImage)
    private readonly imageRepository: Repository<AdImage>,
    @InjectRepository(AdFavorite)
    private readonly favoriteRepository: Repository<AdFavorite>,
    @InjectRepository(AdExtension)
    private readonly extensionRepository: Repository<AdExtension>,
    @InjectRepository(AdCategory)
    private readonly categoryRepository: Repository<AdCategory>,
    @InjectRepository(AdPropertyValue)
    private readonly propertyValueRepository: Repository<AdPropertyValue>,
    @InjectRepository(CategoryProperty)
    private readonly categoryPropertyRepository: Repository<CategoryProperty>,
  ) {}

  // ── İLAN LİSTESİ (Public) ─────────────────────────────────────────────────

  async findAll(dto: QueryAdDto) {
    const { page = 1, limit = 20, category_id, min_price, max_price, sort = '-created_at', search } = dto;

    const qb = this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.category', 'category')
      .leftJoinAndSelect('category.parent', 'parent_category')
      .leftJoinAndSelect('ad.images', 'images')
      .leftJoinAndSelect('images.file', 'file')
      .where('ad.status = :status', { status: 'approved' })
      .andWhere('ad.expires_at > :now', { now: new Date() });

    // Kategori filtresi
    if (category_id) {
      qb.andWhere(
        new Brackets((inner) => {
          inner
            .where('ad.category_id = :catId', { catId: category_id })
            .orWhere('category.parent_id = :catId', { catId: category_id });
        }),
      );
    }

    // Fiyat filtresi
    if (min_price !== undefined) {
      qb.andWhere('ad.price >= :minPrice', { minPrice: min_price });
    }
    if (max_price !== undefined) {
      qb.andWhere('ad.price <= :maxPrice', { maxPrice: max_price });
    }

    // Full-text search (PostgreSQL)
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      qb.andWhere(
        new Brackets((inner) => {
          inner
            .where('ad.title ILIKE :term', { term })
            .orWhere('ad.description ILIKE :term', { term });
        }),
      );
    }

    // Sıralama
    switch (sort) {
      case 'price':
        qb.orderBy('ad.price', 'ASC');
        break;
      case '-price':
        qb.orderBy('ad.price', 'DESC');
        break;
      case 'view_count':
        qb.orderBy('ad.view_count', 'DESC');
        break;
      case '-created_at':
      default:
        qb.orderBy('ad.created_at', 'DESC');
        break;
    }

    qb.skip(getPaginationOffset(page, limit)).take(limit);

    const [ads, total] = await qb.getManyAndCount();

    return { ads, meta: getPaginationMeta(total, page, limit) };
  }

  // ── İLAN DETAYI (Public) ───────────────────────────────────────────────────

  async findOne(id: string) {
    const ad = await this.adRepository.findOne({
      where: { id, status: 'approved' },
      relations: [
        'category',
        'category.parent',
        'images',
        'images.file',
        'user',
        'property_values',
        'property_values.property',
      ],
    });

    if (!ad) {
      throw new NotFoundException('İlan bulunamadı');
    }

    // Görüntülenme sayısını artır
    await this.adRepository.increment({ id }, 'view_count', 1);

    return ad;
  }

  // ── İLAN OLUŞTUR ──────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateAdDto) {
    // Günlük limit kontrolü (10 ilan/gün)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyCount = await this.adRepository
      .createQueryBuilder('ad')
      .where('ad.user_id = :userId', { userId })
      .andWhere('ad.created_at >= :today', { today })
      .getCount();

    if (dailyCount >= 10) {
      throw new BadRequestException('Günlük ilan limitine ulaştınız (maksimum 10 ilan)');
    }

    // Kategori kontrolü (leaf category olmalı)
    const category = await this.categoryRepository.findOne({
      where: { id: dto.category_id, is_active: true },
    });
    if (!category) {
      throw new BadRequestException('Geçersiz veya aktif olmayan kategori');
    }

    const childCount = await this.categoryRepository.count({
      where: { parent_id: dto.category_id },
    });
    if (childCount > 0) {
      throw new BadRequestException('Lütfen alt kategori seçin');
    }

    // cover_image_id, image_ids içinde olmalı
    if (!dto.image_ids.includes(dto.cover_image_id)) {
      throw new BadRequestException('Kapak fotoğrafı yüklenen fotoğraflar arasında olmalıdır');
    }

    // İlan oluştur — expires_at = NOW + 7 gün (CLAUDE.md iş kuralı)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const ad = this.adRepository.create({
      category_id: dto.category_id,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      contact_phone: dto.contact_phone,
      seller_name: dto.seller_name,
      user_id: userId,
      status: 'pending',
      expires_at: expiresAt,
    } as DeepPartial<Ad>);

    const saved = await this.adRepository.save(ad);

    // Görselleri kaydet
    const imageEntities = dto.image_ids.map((fileId, index) =>
      this.imageRepository.create({
        ad_id: saved.id,
        file_id: fileId,
        is_cover: fileId === dto.cover_image_id,
        display_order: index,
      }),
    );
    await this.imageRepository.save(imageEntities);

    // Property değerlerini kaydet
    if (dto.properties?.length) {
      const propEntities = dto.properties.map((p) =>
        this.propertyValueRepository.create({
          ad_id: saved.id,
          property_id: p.property_id,
          value: p.value,
        }),
      );
      await this.propertyValueRepository.save(propEntities);
    }

    this.logger.log(`İlan oluşturuldu: ${saved.id} (kullanıcı: ${userId})`);

    return {
      ad: {
        id: saved.id,
        status: saved.status,
        title: saved.title,
        expires_at: saved.expires_at,
        message: 'İlanınız incelemeye alındı. Kısa sürede onaylanacak.',
      },
    };
  }

  // ── İLAN GÜNCELLE (Owner only) ────────────────────────────────────────────

  async update(id: string, userId: string, dto: UpdateAdDto) {
    const ad = await this.adRepository.findOne({ where: { id } });
    if (!ad) {
      throw new NotFoundException('İlan bulunamadı');
    }
    if (ad.user_id !== userId) {
      throw new ForbiddenException('Bu ilan size ait değil');
    }

    // Kategori değişiyorsa kontrol et
    if (dto.category_id && dto.category_id !== ad.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.category_id, is_active: true },
      });
      if (!category) {
        throw new BadRequestException('Geçersiz kategori');
      }
    }

    // Onaylı ilan güncellenirse → tekrar moderasyona (pending)
    const newStatus = ad.status === 'approved' ? 'pending' : ad.status;

    const updated = this.adRepository.merge(ad, {
      ...dto,
      status: newStatus,
    } as DeepPartial<Ad>);

    const result = await this.adRepository.save(updated);

    // Property güncelleme
    if (dto.properties?.length) {
      await this.propertyValueRepository.delete({ ad_id: id });
      const propEntities = dto.properties.map((p) =>
        this.propertyValueRepository.create({
          ad_id: id,
          property_id: p.property_id,
          value: p.value,
        }),
      );
      await this.propertyValueRepository.save(propEntities);
    }

    return result;
  }

  // ── İLAN SİL (Owner only, Soft delete) ────────────────────────────────────

  async remove(id: string, userId: string) {
    const ad = await this.adRepository.findOne({ where: { id } });
    if (!ad) {
      throw new NotFoundException('İlan bulunamadı');
    }
    if (ad.user_id !== userId) {
      throw new ForbiddenException('Bu ilan size ait değil');
    }

    await this.adRepository.softDelete(id);
    this.logger.log(`İlan silindi: ${id}`);

    return { message: 'İlan silindi' };
  }

  // ── İLAN UZATMA (Reklam izleme) ───────────────────────────────────────────

  async extend(id: string, userId: string, dto: ExtendAdDto) {
    const ad = await this.adRepository.findOne({ where: { id } });
    if (!ad) {
      throw new NotFoundException('İlan bulunamadı');
    }
    if (ad.user_id !== userId) {
      throw new ForbiddenException('Bu ilan size ait değil');
    }
    if (ad.extension_count >= ad.max_extensions) {
      throw new BadRequestException(
        `Maksimum uzatma hakkına ulaştınız (${ad.max_extensions} kere)`,
      );
    }

    // 1 reklam izleme = 1 gün uzatma (CLAUDE.md iş kuralı)
    const daysToExtend = dto.ads_watched;
    const newExpiresAt = new Date(ad.expires_at);
    newExpiresAt.setDate(newExpiresAt.getDate() + daysToExtend);

    ad.expires_at = newExpiresAt;
    ad.extension_count += 1;
    await this.adRepository.save(ad);

    // Uzatma kaydı oluştur
    const extension = this.extensionRepository.create({
      ad_id: id,
      user_id: userId,
      ads_watched: dto.ads_watched,
      days_extended: daysToExtend,
    });
    await this.extensionRepository.save(extension);

    this.logger.log(`İlan uzatıldı: ${id}, +${daysToExtend} gün`);

    return {
      ad: {
        id: ad.id,
        expires_at: ad.expires_at,
        extension_count: ad.extension_count,
        max_extensions: ad.max_extensions,
        remaining_extensions: ad.max_extensions - ad.extension_count,
      },
      message: `İlanınız ${daysToExtend} gün uzatıldı`,
    };
  }

  // ── FAVORİ EKLE ───────────────────────────────────────────────────────────

  async addFavorite(adId: string, userId: string) {
    const ad = await this.adRepository.findOne({
      where: { id: adId, status: 'approved' },
    });
    if (!ad) {
      throw new NotFoundException('İlan bulunamadı');
    }

    // Zaten favori mi?
    const existing = await this.favoriteRepository.findOne({
      where: { ad_id: adId, user_id: userId },
    });
    if (existing) {
      throw new BadRequestException('Bu ilan zaten favorilerinizde');
    }

    // Max 30 favori kontrolü
    const favCount = await this.favoriteRepository.count({
      where: { user_id: userId },
    });
    if (favCount >= 30) {
      throw new BadRequestException('Maksimum 30 favori ekleyebilirsiniz');
    }

    const favorite = this.favoriteRepository.create({
      ad_id: adId,
      user_id: userId,
    });
    await this.favoriteRepository.save(favorite);

    return { message: 'Favorilere eklendi' };
  }

  // ── FAVORİ KALDIR ─────────────────────────────────────────────────────────

  async removeFavorite(adId: string, userId: string) {
    const favorite = await this.favoriteRepository.findOne({
      where: { ad_id: adId, user_id: userId },
    });
    if (!favorite) {
      throw new NotFoundException('Favori bulunamadı');
    }

    await this.favoriteRepository.remove(favorite);

    return { message: 'Favorilerden çıkarıldı' };
  }

  // ── BENİM İLANLARIM ──────────────────────────────────────────────────────

  async findMyAds(userId: string, dto: QueryMyAdsDto) {
    const { page = 1, limit = 20, status } = dto;

    const qb = this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.images', 'images')
      .leftJoinAndSelect('images.file', 'file')
      .where('ad.user_id = :userId', { userId });

    if (status) {
      qb.andWhere('ad.status = :status', { status });
    }

    qb.orderBy('ad.created_at', 'DESC')
      .skip(getPaginationOffset(page, limit))
      .take(limit);

    const [ads, total] = await qb.getManyAndCount();

    return { ads, meta: getPaginationMeta(total, page, limit) };
  }

  // ── FAVORİLERİM ──────────────────────────────────────────────────────────

  async findMyFavorites(userId: string) {
    const favorites = await this.favoriteRepository.find({
      where: { user_id: userId },
      relations: ['ad', 'ad.images', 'ad.images.file'],
      order: { created_at: 'DESC' },
    });

    return { favorites };
  }

  // ── KATEGORİLER ───────────────────────────────────────────────────────────

  async findCategories(parentId?: string) {
    const where: any = { is_active: true };
    if (parentId) {
      where.parent_id = parentId;
    } else {
      where.parent_id = null as any;
    }

    return this.categoryRepository.find({
      where,
      relations: ['children'],
      order: { display_order: 'ASC' },
    });
  }

  // ── KATEGORİ ÖZELLİKLERİ ─────────────────────────────────────────────────

  async findCategoryProperties(categoryId: string) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, is_active: true },
    });
    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    const properties = await this.categoryPropertyRepository.find({
      where: { category_id: categoryId },
      relations: ['options'],
      order: { display_order: 'ASC' },
    });

    return { category, properties };
  }

  // ── TELEFON / WHATSAPP TIKLAMA ────────────────────────────────────────────

  async trackPhoneClick(id: string) {
    const ad = await this.adRepository.findOne({
      where: { id, status: 'approved' },
    });
    if (!ad) {
      throw new NotFoundException('İlan bulunamadı');
    }

    await this.adRepository.increment({ id }, 'phone_click_count', 1);
    return { phone: ad.contact_phone };
  }

  async trackWhatsappClick(id: string) {
    const ad = await this.adRepository.findOne({
      where: { id, status: 'approved' },
    });
    if (!ad) {
      throw new NotFoundException('İlan bulunamadı');
    }

    await this.adRepository.increment({ id }, 'whatsapp_click_count', 1);
    const phone = ad.contact_phone.replace(/^0/, '90');
    return { whatsapp_url: `https://wa.me/${phone}` };
  }
}
