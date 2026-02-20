import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Place, PlaceCategory, PlaceImage } from '../database/entities/place.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeQb(data: any[] = []) {
  const qb: any = {};
  const chain = ['leftJoinAndSelect', 'where', 'andWhere', 'orderBy'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getMany = jest.fn().mockResolvedValue(data);
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeCategory = (): PlaceCategory =>
  ({ id: 'cat-uuid-1', name: 'Tarihi Yerler' } as PlaceCategory);

const makePlace = (overrides: Partial<Place> = {}): Place =>
  ({
    id: 'place-uuid-1',
    name: 'Karatepe-Aslantaş Açıkhava Müzesi',
    description: 'Geç Hitit dönemi...',
    category: makeCategory(),
    is_free: false,
    entrance_fee: 20,
    distance_from_center: 22,
    latitude: 37.2345,
    longitude: 36.5678,
    is_active: true,
    cover_image: null,
    images: [],
    ...overrides,
  } as Place);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('PlacesService', () => {
  let service: PlacesService;
  let placeRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        { provide: getRepositoryToken(Place), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<PlacesService>(PlacesService);
    placeRepo = module.get(getRepositoryToken(Place));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('aktif mekanları döndürmeli', async () => {
      const places = [makePlace()];
      const qb = makeQb(places);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});

      expect(result.places).toHaveLength(1);
    });

    it('sadece aktif mekanlar filtrelenmeli', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.where).toHaveBeenCalledWith(
        'p.is_active = :active',
        { active: true },
      );
    });

    it('category ve cover_image ilişkileri yüklenmeli', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('p.category', 'category');
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('p.cover_image', 'cover_image');
    });

    it('varsayılan sıralama: name ASC', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.orderBy).toHaveBeenCalledWith('p.name', 'ASC');
    });

    it('sort=distance olduğunda distance_from_center ASC sıralanmalı', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ sort: 'distance' });

      expect(qb.orderBy).toHaveBeenCalledWith('p.distance_from_center', 'ASC');
    });

    it('sort=name olduğunda name ASC sıralanmalı', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ sort: 'name' });

      expect(qb.orderBy).toHaveBeenCalledWith('p.name', 'ASC');
    });

    it('category_id filtresi uygulanmalı', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ category_id: 'cat-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'p.category_id = :category_id',
        { category_id: 'cat-uuid-1' },
      );
    });

    it('is_free filtresi uygulanmalı', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ is_free: true });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'p.is_free = :is_free',
        { is_free: true },
      );
    });

    it('filtre verilmediğinde andWhere çağrılmamalı', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('user_lat/lng verildiğinde user_distance hesaplanmalı', async () => {
      const place = makePlace({ latitude: 37.2345, longitude: 36.5678 });
      const qb = makeQb([place]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({
        user_lat: 37.3667,
        user_lng: 36.1,
      });

      expect(result.places[0].user_distance).not.toBeNull();
      expect(typeof result.places[0].user_distance).toBe('number');
    });

    it('user koordinatı verilmediğinde user_distance null olmalı', async () => {
      const place = makePlace();
      const qb = makeQb([place]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});

      expect(result.places[0].user_distance).toBeNull();
    });

    it('Haversine mesafesi km cinsinden pozitif değer döndürmeli', async () => {
      // Kadirli merkezi ile Karatepe arası ~22 km
      const place = makePlace({
        latitude: 37.2345,
        longitude: 36.5678,
      });
      const qb = makeQb([place]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({
        user_lat: 37.3667,
        user_lng: 36.1,
      });

      expect(result.places[0].user_distance).toBeGreaterThan(0);
    });

    it('aynı koordinat için user_distance sıfır olmalı', async () => {
      const place = makePlace({ latitude: 37.3667, longitude: 36.1 });
      const qb = makeQb([place]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({
        user_lat: 37.3667,
        user_lng: 36.1,
      });

      expect(result.places[0].user_distance).toBe(0);
    });

    it('sonuçlarda gerekli alanlar bulunmalı', async () => {
      const place = makePlace();
      const qb = makeQb([place]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});

      const p = result.places[0];
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('category');
      expect(p).toHaveProperty('is_free');
      expect(p).toHaveProperty('entrance_fee');
      expect(p).toHaveProperty('distance_from_center');
      expect(p).toHaveProperty('user_distance');
      expect(p).toHaveProperty('cover_image');
    });

    it('boş liste döndürmeli', async () => {
      const qb = makeQb([]);
      placeRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({});

      expect(result.places).toEqual([]);
    });
  });

  // ── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('mekan detayını döndürmeli', async () => {
      const place = makePlace();
      placeRepo.findOne.mockResolvedValue(place);

      const result = await service.findOne('place-uuid-1');

      expect(result.place).toBe(place);
      expect(placeRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'place-uuid-1', is_active: true },
        relations: ['category', 'cover_image', 'images', 'images.file'],
      });
    });

    it('mekan bulunamazsa NotFoundException fırlatmalı', async () => {
      placeRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('is_active=false mekan bulunamazsa NotFoundException fırlatmalı', async () => {
      placeRepo.findOne.mockResolvedValue(null); // where koşulu karşılanmıyor

      await expect(service.findOne('inactive-place')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('images ilişkisi yüklenmiş olmalı', async () => {
      const place = makePlace({ images: [] as PlaceImage[] });
      placeRepo.findOne.mockResolvedValue(place);

      const result = await service.findOne('place-uuid-1');

      expect(result.place.images).toBeDefined();
    });
  });
});
