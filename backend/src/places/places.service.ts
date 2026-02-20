import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place, PlaceCategory, PlaceImage } from '../database/entities/place.entity';
import { QueryPlaceDto } from './dto/query-place.dto';

// Haversine formülü: iki koordinat arasındaki mesafeyi km cinsinden hesaplar
function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // 1 ondalık basamak
}

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) {}

  // ── MEKAN LİSTESİ ─────────────────────────────────────────────────────────

  async findAll(dto: QueryPlaceDto) {
    const { category_id, is_free, sort = 'name', user_lat, user_lng } = dto;

    const qb = this.placeRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.cover_image', 'cover_image')
      .where('p.is_active = :active', { active: true });

    if (category_id) {
      qb.andWhere('p.category_id = :category_id', { category_id });
    }

    if (is_free !== undefined) {
      qb.andWhere('p.is_free = :is_free', { is_free });
    }

    // Sıralama: distance (distance_from_center ASC) veya name (ASC)
    if (sort === 'distance') {
      qb.orderBy('p.distance_from_center', 'ASC');
    } else {
      qb.orderBy('p.name', 'ASC');
    }

    const places = await qb.getMany();

    // user_lat + user_lng verilmişse Haversine ile kullanıcı mesafesi ekle
    const hasUserCoords =
      user_lat !== undefined && user_lng !== undefined;

    const result = places.map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description,
      category: place.category,
      is_free: place.is_free,
      entrance_fee: place.entrance_fee,
      distance_from_center: place.distance_from_center,
      user_distance: hasUserCoords
        ? haversineKm(user_lat!, user_lng!, Number(place.latitude), Number(place.longitude))
        : null,
      cover_image: place.cover_image,
    }));

    return { places: result };
  }

  // ── MEKAN DETAYI ──────────────────────────────────────────────────────────

  async findOne(id: string) {
    const place = await this.placeRepository.findOne({
      where: { id, is_active: true },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    if (!place) {
      throw new NotFoundException('Mekan bulunamadı');
    }

    return { place };
  }
}
