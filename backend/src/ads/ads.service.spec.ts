import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { Ad } from '../database/entities/ad.entity';
import { AdImage } from '../database/entities/ad-image.entity';
import { AdFavorite } from '../database/entities/ad-favorite.entity';
import { AdExtension } from '../database/entities/ad-extension.entity';
import { AdCategory } from '../database/entities/ad-category.entity';
import { AdPropertyValue } from '../database/entities/ad-property-value.entity';
import { CategoryProperty } from '../database/entities/category-property.entity';

// ─── QueryBuilder mock fabrikası ─────────────────────────────────────────────

function makeQb(data: any[] = [], total = 0) {
  const qb: any = {};
  const chainMethods = [
    'leftJoinAndSelect', 'where', 'andWhere', 'orWhere',
    'orderBy', 'skip', 'take', 'select',
  ];
  chainMethods.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getManyAndCount = jest.fn().mockResolvedValue([data, total]);
  qb.getCount = jest.fn().mockResolvedValue(total);
  return qb;
}

// ─── Yardımcı fabrikalar ─────────────────────────────────────────────────────

const makeAd = (overrides: Partial<Ad> = {}): Ad =>
  ({
    id: 'ad-uuid-1',
    category_id: 'cat-uuid-1',
    title: 'Test İlanı',
    description: 'Açıklama metni burada',
    price: 5000,
    user_id: 'user-uuid-1',
    contact_phone: '05551234567',
    seller_name: 'Ahmet',
    status: 'approved',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    extension_count: 0,
    max_extensions: 3,
    view_count: 10,
    phone_click_count: 2,
    whatsapp_click_count: 1,
    images: [],
    favorites: [],
    extensions: [],
    property_values: [],
    created_at: new Date('2026-02-10'),
    updated_at: new Date('2026-02-10'),
    ...overrides,
  } as Ad);

const makeCategory = (overrides: Partial<AdCategory> = {}): AdCategory =>
  ({
    id: 'cat-uuid-1',
    name: 'Elektronik',
    slug: 'elektronik',
    parent_id: null,
    is_active: true,
    display_order: 0,
    ...overrides,
  } as AdCategory);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('AdsService', () => {
  let service: AdsService;
  let adRepo: any;
  let imageRepo: any;
  let favoriteRepo: any;
  let extensionRepo: any;
  let categoryRepo: any;
  let propertyValueRepo: any;
  let categoryPropertyRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      create: jest.fn((dto: any) => dto),
      count: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
      softDelete: jest.fn(),
      increment: jest.fn(),
      merge: jest.fn((entity: any, dto: any) => ({ ...entity, ...dto })),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdsService,
        { provide: getRepositoryToken(Ad), useFactory: mockRepo },
        { provide: getRepositoryToken(AdImage), useFactory: mockRepo },
        { provide: getRepositoryToken(AdFavorite), useFactory: mockRepo },
        { provide: getRepositoryToken(AdExtension), useFactory: mockRepo },
        { provide: getRepositoryToken(AdCategory), useFactory: mockRepo },
        { provide: getRepositoryToken(AdPropertyValue), useFactory: mockRepo },
        { provide: getRepositoryToken(CategoryProperty), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<AdsService>(AdsService);
    adRepo = module.get(getRepositoryToken(Ad));
    imageRepo = module.get(getRepositoryToken(AdImage));
    favoriteRepo = module.get(getRepositoryToken(AdFavorite));
    extensionRepo = module.get(getRepositoryToken(AdExtension));
    categoryRepo = module.get(getRepositoryToken(AdCategory));
    propertyValueRepo = module.get(getRepositoryToken(AdPropertyValue));
    categoryPropertyRepo = module.get(getRepositoryToken(CategoryProperty));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('onaylı ve süresi dolmamış ilanları sayfalı döndürmeli', async () => {
      const ads = [makeAd()];
      const qb = makeQb(ads, 1);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.ads).toEqual(ads);
      expect(result.meta.total).toBe(1);
      expect(qb.where).toHaveBeenCalledWith('ad.status = :status', { status: 'approved' });
    });

    it('kategoriye göre filtreleyebilmeli', async () => {
      const qb = makeQb([], 0);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ category_id: 'cat-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalled();
    });

    it('fiyat aralığına göre filtreleyebilmeli', async () => {
      const qb = makeQb([], 0);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ min_price: 1000, max_price: 5000 });

      expect(qb.andWhere).toHaveBeenCalledWith('ad.price >= :minPrice', { minPrice: 1000 });
      expect(qb.andWhere).toHaveBeenCalledWith('ad.price <= :maxPrice', { maxPrice: 5000 });
    });

    it('search ile ILIKE araması yapmalı', async () => {
      const qb = makeQb([], 0);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ search: 'iphone' });

      expect(qb.andWhere).toHaveBeenCalled();
    });

    it('fiyata göre sıralamalı (price)', async () => {
      const qb = makeQb([], 0);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ sort: 'price' });

      expect(qb.orderBy).toHaveBeenCalledWith('ad.price', 'ASC');
    });

    it('fiyata göre azalan sıralamalı (-price)', async () => {
      const qb = makeQb([], 0);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ sort: '-price' });

      expect(qb.orderBy).toHaveBeenCalledWith('ad.price', 'DESC');
    });

    it('görüntülenmeye göre sıralamalı (view_count)', async () => {
      const qb = makeQb([], 0);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ sort: 'view_count' });

      expect(qb.orderBy).toHaveBeenCalledWith('ad.view_count', 'DESC');
    });
  });

  // ── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('ilan detayını döndürmeli ve view_count artırmalı', async () => {
      const ad = makeAd();
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.increment.mockResolvedValue({});

      const result = await service.findOne('ad-uuid-1');

      expect(result).toBe(ad);
      expect(adRepo.increment).toHaveBeenCalledWith({ id: 'ad-uuid-1' }, 'view_count', 1);
    });

    it('ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    const createDto = {
      category_id: 'cat-uuid-1',
      title: 'Yeni İlan Başlığı',
      description: 'Açıklama metni en az 10 karakter',
      price: 3000,
      contact_phone: '05551234567',
      image_ids: ['img-1', 'img-2'],
      cover_image_id: 'img-1',
    };

    it('başarıyla ilan oluşturmalı (status=pending, expires_at=+7gün)', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0); // günlük limit: 0
      adRepo.createQueryBuilder.mockReturnValue(qb);
      categoryRepo.findOne.mockResolvedValue(makeCategory());
      categoryRepo.count.mockResolvedValue(0); // leaf category
      adRepo.create.mockReturnValue({ ...createDto, id: 'new-ad', status: 'pending' });
      adRepo.save.mockResolvedValue({
        id: 'new-ad',
        status: 'pending',
        title: createDto.title,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      imageRepo.create.mockImplementation((dto: any) => dto);
      imageRepo.save.mockResolvedValue([]);

      const result = await service.create('user-uuid-1', createDto);

      expect(result.ad.status).toBe('pending');
      expect(result.ad.id).toBe('new-ad');
      expect(imageRepo.save).toHaveBeenCalled();
    });

    it('günlük 10 ilan limitini aşınca BadRequestException fırlatmalı', async () => {
      const qb = makeQb([], 10);
      qb.getCount = jest.fn().mockResolvedValue(10);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.create('user-uuid-1', createDto)).rejects.toThrow(BadRequestException);
    });

    it('geçersiz kategori ise BadRequestException fırlatmalı', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      adRepo.createQueryBuilder.mockReturnValue(qb);
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.create('user-uuid-1', createDto)).rejects.toThrow(BadRequestException);
    });

    it('alt kategorisi olan kategori seçilirse BadRequestException fırlatmalı', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      adRepo.createQueryBuilder.mockReturnValue(qb);
      categoryRepo.findOne.mockResolvedValue(makeCategory());
      categoryRepo.count.mockResolvedValue(3); // 3 alt kategori var

      await expect(service.create('user-uuid-1', createDto)).rejects.toThrow(BadRequestException);
    });

    it('cover_image_id image_ids içinde değilse BadRequestException fırlatmalı', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      adRepo.createQueryBuilder.mockReturnValue(qb);
      categoryRepo.findOne.mockResolvedValue(makeCategory());
      categoryRepo.count.mockResolvedValue(0);

      const badDto = { ...createDto, cover_image_id: 'not-in-list' };
      await expect(service.create('user-uuid-1', badDto)).rejects.toThrow(BadRequestException);
    });

    it('property değerleri varsa kaydedilmeli', async () => {
      const qb = makeQb([], 0);
      qb.getCount = jest.fn().mockResolvedValue(0);
      adRepo.createQueryBuilder.mockReturnValue(qb);
      categoryRepo.findOne.mockResolvedValue(makeCategory());
      categoryRepo.count.mockResolvedValue(0);
      adRepo.save.mockResolvedValue({
        id: 'new-ad',
        status: 'pending',
        title: 'test',
        expires_at: new Date(),
      });
      imageRepo.save.mockResolvedValue([]);
      propertyValueRepo.create.mockImplementation((dto: any) => dto);
      propertyValueRepo.save.mockResolvedValue([]);

      const dtoWithProps = {
        ...createDto,
        properties: [{ property_id: 'prop-1', value: 'Apple' }],
      };
      await service.create('user-uuid-1', dtoWithProps);

      expect(propertyValueRepo.save).toHaveBeenCalled();
    });
  });

  // ── update ────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('ilan sahibi güncelleyebilmeli', async () => {
      const ad = makeAd({ status: 'pending' });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.save.mockResolvedValue({ ...ad, title: 'Güncel' });

      const result = await service.update('ad-uuid-1', 'user-uuid-1', { title: 'Güncel' });

      expect(result.title).toBe('Güncel');
    });

    it('onaylı ilan güncellenince status=pending olmalı (re-moderation)', async () => {
      const ad = makeAd({ status: 'approved' });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.save.mockImplementation((entity: any) => Promise.resolve(entity));

      const result = await service.update('ad-uuid-1', 'user-uuid-1', { title: 'Değişti' });

      expect(result.status).toBe('pending');
    });

    it('başkasının ilanını güncelleyince ForbiddenException fırlatmalı', async () => {
      const ad = makeAd({ user_id: 'baska-user' });
      adRepo.findOne.mockResolvedValue(ad);

      await expect(
        service.update('ad-uuid-1', 'user-uuid-1', { title: 'X' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('unknown', 'user-uuid-1', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('kategori değiştiğinde kontrol yapmalı', async () => {
      const ad = makeAd();
      adRepo.findOne.mockResolvedValue(ad);
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.update('ad-uuid-1', 'user-uuid-1', { category_id: 'yeni-cat' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('property güncellemesi yapılmalı', async () => {
      const ad = makeAd({ status: 'pending' });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.save.mockResolvedValue(ad);
      propertyValueRepo.delete.mockResolvedValue({});
      propertyValueRepo.create.mockImplementation((dto: any) => dto);
      propertyValueRepo.save.mockResolvedValue([]);

      await service.update('ad-uuid-1', 'user-uuid-1', {
        properties: [{ property_id: 'p1', value: 'V1' }],
      });

      expect(propertyValueRepo.delete).toHaveBeenCalledWith({ ad_id: 'ad-uuid-1' });
      expect(propertyValueRepo.save).toHaveBeenCalled();
    });
  });

  // ── remove ────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('ilan sahibi silebilmeli (soft delete)', async () => {
      const ad = makeAd();
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.softDelete.mockResolvedValue({});

      const result = await service.remove('ad-uuid-1', 'user-uuid-1');

      expect(adRepo.softDelete).toHaveBeenCalledWith('ad-uuid-1');
      expect(result.message).toBe('İlan silindi');
    });

    it('başkasının ilanını silemez', async () => {
      adRepo.findOne.mockResolvedValue(makeAd({ user_id: 'baska' }));

      await expect(service.remove('ad-uuid-1', 'user-uuid-1')).rejects.toThrow(ForbiddenException);
    });

    it('ilan yoksa NotFoundException', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('x', 'y')).rejects.toThrow(NotFoundException);
    });
  });

  // ── extend ────────────────────────────────────────────────────────────────

  describe('extend', () => {
    it('3 reklam izleme = 3 gün uzatma yapmalı', async () => {
      const expires = new Date('2026-02-17');
      const ad = makeAd({ expires_at: expires, extension_count: 0 });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.save.mockImplementation((e: any) => Promise.resolve(e));
      extensionRepo.create.mockImplementation((d: any) => d);
      extensionRepo.save.mockResolvedValue({});

      const result = await service.extend('ad-uuid-1', 'user-uuid-1', { ads_watched: 3 });

      expect(result.ad.extension_count).toBe(1);
      expect(result.ad.remaining_extensions).toBe(2);
      expect(result.message).toContain('3 gün');
      // expires_at 3 gün uzamalı
      const expected = new Date('2026-02-20');
      expect(ad.expires_at.toISOString().slice(0, 10)).toBe(expected.toISOString().slice(0, 10));
    });

    it('1 reklam izleme = 1 gün uzatma', async () => {
      const expires = new Date('2026-02-17');
      const ad = makeAd({ expires_at: expires, extension_count: 1 });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.save.mockImplementation((e: any) => Promise.resolve(e));
      extensionRepo.create.mockImplementation((d: any) => d);
      extensionRepo.save.mockResolvedValue({});

      const result = await service.extend('ad-uuid-1', 'user-uuid-1', { ads_watched: 1 });

      expect(result.ad.extension_count).toBe(2);
      const expected = new Date('2026-02-18');
      expect(ad.expires_at.toISOString().slice(0, 10)).toBe(expected.toISOString().slice(0, 10));
    });

    it('max uzatma (3) aşılınca BadRequestException', async () => {
      const ad = makeAd({ extension_count: 3, max_extensions: 3 });
      adRepo.findOne.mockResolvedValue(ad);

      await expect(
        service.extend('ad-uuid-1', 'user-uuid-1', { ads_watched: 3 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('başkasının ilanını uzatamaz', async () => {
      adRepo.findOne.mockResolvedValue(makeAd({ user_id: 'baska' }));

      await expect(
        service.extend('ad-uuid-1', 'user-uuid-1', { ads_watched: 1 }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('ilan yoksa NotFoundException', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(
        service.extend('x', 'y', { ads_watched: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── addFavorite ───────────────────────────────────────────────────────────

  describe('addFavorite', () => {
    it('favoriye ekleyebilmeli', async () => {
      adRepo.findOne.mockResolvedValue(makeAd());
      favoriteRepo.findOne.mockResolvedValue(null);
      favoriteRepo.count.mockResolvedValue(5);
      favoriteRepo.create.mockImplementation((d: any) => d);
      favoriteRepo.save.mockResolvedValue({});

      const result = await service.addFavorite('ad-uuid-1', 'user-uuid-1');

      expect(result.message).toBe('Favorilere eklendi');
    });

    it('zaten favorideyse BadRequestException', async () => {
      adRepo.findOne.mockResolvedValue(makeAd());
      favoriteRepo.findOne.mockResolvedValue({ id: 'fav-1' });

      await expect(service.addFavorite('ad-uuid-1', 'user-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('30 favori limitini aşınca BadRequestException', async () => {
      adRepo.findOne.mockResolvedValue(makeAd());
      favoriteRepo.findOne.mockResolvedValue(null);
      favoriteRepo.count.mockResolvedValue(30);

      await expect(service.addFavorite('ad-uuid-1', 'user-uuid-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('ilan yoksa NotFoundException', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(service.addFavorite('x', 'y')).rejects.toThrow(NotFoundException);
    });
  });

  // ── removeFavorite ────────────────────────────────────────────────────────

  describe('removeFavorite', () => {
    it('favoriyi kaldırabilmeli', async () => {
      favoriteRepo.findOne.mockResolvedValue({ id: 'fav-1' });
      favoriteRepo.remove.mockResolvedValue({});

      const result = await service.removeFavorite('ad-uuid-1', 'user-uuid-1');

      expect(result.message).toBe('Favorilerden çıkarıldı');
    });

    it('favori yoksa NotFoundException', async () => {
      favoriteRepo.findOne.mockResolvedValue(null);

      await expect(service.removeFavorite('x', 'y')).rejects.toThrow(NotFoundException);
    });
  });

  // ── findMyAds ─────────────────────────────────────────────────────────────

  describe('findMyAds', () => {
    it('kullanıcının ilanlarını döndürmeli', async () => {
      const ads = [makeAd()];
      const qb = makeQb(ads, 1);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findMyAds('user-uuid-1', { page: 1, limit: 20 });

      expect(result.ads).toEqual(ads);
      expect(qb.where).toHaveBeenCalledWith('ad.user_id = :userId', { userId: 'user-uuid-1' });
    });

    it('status filtresi uygulanabilmeli', async () => {
      const qb = makeQb([], 0);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findMyAds('user-uuid-1', { status: 'pending' });

      expect(qb.andWhere).toHaveBeenCalledWith('ad.status = :status', { status: 'pending' });
    });
  });

  // ── findMyFavorites ───────────────────────────────────────────────────────

  describe('findMyFavorites', () => {
    it('kullanıcının favorilerini döndürmeli', async () => {
      const favs = [{ id: 'fav-1', ad: makeAd() }];
      favoriteRepo.find.mockResolvedValue(favs);

      const result = await service.findMyFavorites('user-uuid-1');

      expect(result.favorites).toEqual(favs);
      expect(favoriteRepo.find).toHaveBeenCalledWith({
        where: { user_id: 'user-uuid-1' },
        relations: ['ad', 'ad.images', 'ad.images.file'],
        order: { created_at: 'DESC' },
      });
    });
  });

  // ── findCategories ────────────────────────────────────────────────────────

  describe('findCategories', () => {
    it('ana kategorileri döndürmeli (parentId yok)', async () => {
      const cats = [makeCategory()];
      categoryRepo.find.mockResolvedValue(cats);

      const result = await service.findCategories();

      expect(result).toEqual(cats);
    });

    it('alt kategorileri döndürmeli (parentId var)', async () => {
      categoryRepo.find.mockResolvedValue([]);

      await service.findCategories('parent-uuid');

      expect(categoryRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { is_active: true, parent_id: 'parent-uuid' },
        }),
      );
    });
  });

  // ── findCategoryProperties ────────────────────────────────────────────────

  describe('findCategoryProperties', () => {
    it('kategori özelliklerini döndürmeli', async () => {
      const cat = makeCategory();
      const props = [{ id: 'p1', property_name: 'Marka' }];
      categoryRepo.findOne.mockResolvedValue(cat);
      categoryPropertyRepo.find.mockResolvedValue(props);

      const result = await service.findCategoryProperties('cat-uuid-1');

      expect(result.category).toBe(cat);
      expect(result.properties).toEqual(props);
    });

    it('kategori yoksa NotFoundException', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findCategoryProperties('x')).rejects.toThrow(NotFoundException);
    });
  });

  // ── trackPhoneClick / trackWhatsappClick ──────────────────────────────────

  describe('trackPhoneClick', () => {
    it('telefon click sayısını artırmalı ve numarayı döndürmeli', async () => {
      const ad = makeAd({ contact_phone: '05551234567' });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.increment.mockResolvedValue({});

      const result = await service.trackPhoneClick('ad-uuid-1');

      expect(result.phone).toBe('05551234567');
      expect(adRepo.increment).toHaveBeenCalledWith({ id: 'ad-uuid-1' }, 'phone_click_count', 1);
    });

    it('ilan yoksa NotFoundException', async () => {
      adRepo.findOne.mockResolvedValue(null);
      await expect(service.trackPhoneClick('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('trackWhatsappClick', () => {
    it('WhatsApp URL döndürmeli ve click sayısını artırmalı', async () => {
      const ad = makeAd({ contact_phone: '05551234567' });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.increment.mockResolvedValue({});

      const result = await service.trackWhatsappClick('ad-uuid-1');

      expect(result.whatsapp_url).toBe('https://wa.me/905551234567');
      expect(adRepo.increment).toHaveBeenCalledWith({ id: 'ad-uuid-1' }, 'whatsapp_click_count', 1);
    });

    it('ilan yoksa NotFoundException', async () => {
      adRepo.findOne.mockResolvedValue(null);
      await expect(service.trackWhatsappClick('x')).rejects.toThrow(NotFoundException);
    });
  });
});
