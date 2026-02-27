import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Place,
  PlaceCategory,
  PlaceImage,
} from '../database/entities/place.entity';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { UpdatePlaceCategoryDto } from './dto/update-place-category.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryAdminPlacesDto } from './dto/query-admin-places.dto';
import { AddPlaceImagesDto } from './dto/add-place-images.dto';
import { ReorderPlaceImagesDto } from './dto/reorder-place-images.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class PlacesAdminService {
  constructor(
    @InjectRepository(PlaceCategory)
    private readonly placeCategoryRepository: Repository<PlaceCategory>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(PlaceImage)
    private readonly placeImageRepository: Repository<PlaceImage>,
  ) {}

  private mapPlace(place: Place) {
    return {
      id: place.id,
      category_id: place.category_id ?? null,
      category: place.category
        ? { id: place.category.id, name: place.category.name, icon: place.category.icon ?? null }
        : null,
      name: place.name,
      description: place.description ?? null,
      address: place.address ?? null,
      latitude: place.latitude,
      longitude: place.longitude,
      entrance_fee: place.entrance_fee ?? null,
      is_free: place.is_free,
      opening_hours: place.opening_hours ?? null,
      best_season: place.best_season ?? null,
      how_to_get_there: place.how_to_get_there ?? null,
      distance_from_center: place.distance_from_center ?? null,
      cover_image_id: place.cover_image_id ?? null,
      cover_image_url: (place.cover_image as any)?.url ?? null,
      is_active: place.is_active,
      images: place.images?.map((img) => ({
        id: img.id,
        file_id: img.file_id,
        url: (img.file as any)?.url ?? null,
        display_order: img.display_order,
      })) ?? [],
      created_at: place.created_at,
      updated_at: place.updated_at,
    };
  }

  private generatePlaceSlug(name: string): string {
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

  async getPlaceCategories() {
    const categories = await this.placeCategoryRepository.find({
      order: { display_order: 'ASC', name: 'ASC' },
    });
    return { categories };
  }

  async createPlaceCategory(dto: CreatePlaceCategoryDto) {
    const baseSlug = this.generatePlaceSlug(dto.name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.placeCategoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const category = this.placeCategoryRepository.create({
      name: dto.name,
      slug,
      icon: dto.icon,
      display_order: dto.display_order ?? 0,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.placeCategoryRepository.save(category);
    return { category: saved };
  }

  async updatePlaceCategory(id: string, dto: UpdatePlaceCategoryDto) {
    const category = await this.placeCategoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    const fields: (keyof UpdatePlaceCategoryDto)[] = [
      'name', 'icon', 'display_order', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (category as any)[field] = dto[field];
      }
    }

    const saved = await this.placeCategoryRepository.save(category);
    return { category: saved };
  }

  async deletePlaceCategory(id: string) {
    const category = await this.placeCategoryRepository.findOne({
      where: { id },
      relations: ['places'],
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    if (category.places && category.places.length > 0) {
      throw new BadRequestException(
        'Mekan bulunan kategori silinemez. Önce mekanları silin veya taşıyın.',
      );
    }

    await this.placeCategoryRepository.delete(id);
  }

  async getAdminPlaces(dto: QueryAdminPlacesDto) {
    const { search, category_id, is_active, is_free, page = 1, limit = 20 } = dto;

    const qb = this.placeRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.cover_image', 'cover_image');

    if (search) {
      qb.andWhere(
        '(p.name ILIKE :search OR p.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category_id) {
      qb.andWhere('p.category_id = :category_id', { category_id });
    }

    if (is_active !== undefined) {
      qb.andWhere('p.is_active = :is_active', { is_active });
    }

    if (is_free !== undefined) {
      qb.andWhere('p.is_free = :is_free', { is_free });
    }

    qb.orderBy('p.name', 'ASC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [places, total] = await qb.getManyAndCount();

    return {
      places: places.map((p) => this.mapPlace(p)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async getAdminPlace(id: string) {
    const place = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    if (!place) throw new NotFoundException('Mekan bulunamadı');

    return { place: this.mapPlace(place) };
  }

  async createPlace(dto: CreatePlaceDto, userId: string) {
    if (dto.category_id) {
      const cat = await this.placeCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const place = this.placeRepository.create({
      category_id: dto.category_id,
      name: dto.name,
      description: dto.description,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      entrance_fee: dto.entrance_fee,
      is_free: dto.is_free ?? true,
      opening_hours: dto.opening_hours,
      best_season: dto.best_season,
      how_to_get_there: dto.how_to_get_there,
      distance_from_center: dto.distance_from_center,
      cover_image_id: dto.cover_image_id,
      is_active: dto.is_active ?? true,
      created_by: userId,
    });

    const saved = await this.placeRepository.save(place);

    const full = await this.placeRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(full!) };
  }

  async updatePlace(id: string, dto: UpdatePlaceDto) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('Mekan bulunamadı');

    if (dto.category_id !== undefined && dto.category_id !== null) {
      const cat = await this.placeCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const fields: (keyof UpdatePlaceDto)[] = [
      'category_id', 'name', 'description', 'address', 'latitude', 'longitude',
      'entrance_fee', 'is_free', 'opening_hours', 'best_season',
      'how_to_get_there', 'distance_from_center', 'cover_image_id', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (place as any)[field] = dto[field];
      }
    }

    await this.placeRepository.save(place);

    const updated = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
  }

  async deletePlace(id: string) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('Mekan bulunamadı');
    await this.placeRepository.delete(id);
  }

  async addPlaceImages(id: string, dto: AddPlaceImagesDto) {
    const place = await this.placeRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!place) throw new NotFoundException('Mekan bulunamadı');

    const maxOrder =
      place.images?.reduce((max, img) => Math.max(max, img.display_order), -1) ?? -1;

    const newImages = dto.file_ids.map((file_id, idx) =>
      this.placeImageRepository.create({
        place_id: id,
        file_id,
        display_order: maxOrder + 1 + idx,
      }),
    );

    await this.placeImageRepository.save(newImages);

    const updated = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
  }

  async deletePlaceImage(imageId: string) {
    const image = await this.placeImageRepository.findOne({
      where: { id: imageId },
      relations: ['place'],
    });
    if (!image) throw new NotFoundException('Fotoğraf bulunamadı');

    if (image.place?.cover_image_id === image.file_id) {
      await this.placeRepository.update(image.place_id, { cover_image_id: null as any });
    }

    await this.placeImageRepository.delete(imageId);
  }

  async setPlaceCoverImage(imageId: string) {
    const image = await this.placeImageRepository.findOne({
      where: { id: imageId },
      relations: ['place'],
    });
    if (!image) throw new NotFoundException('Fotoğraf bulunamadı');

    await this.placeRepository.update(image.place_id, { cover_image_id: image.file_id });

    const updated = await this.placeRepository.findOne({
      where: { id: image.place_id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
  }

  async reorderPlaceImages(id: string, dto: ReorderPlaceImagesDto) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('Mekan bulunamadı');

    await Promise.all(
      dto.ordered_ids.map((imageId, idx) =>
        this.placeImageRepository.update(imageId, { display_order: idx }),
      ),
    );

    const updated = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
  }
}
