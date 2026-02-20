import { Test, TestingModule } from '@nestjs/testing';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { User } from '../database/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

// ─── Mock user ───────────────────────────────────────────────────────────────

const mockUser = {
  id: 'user-uuid-1',
  phone: '05551234567',
  username: 'testuser',
  role: UserRole.USER,
} as User;

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('AdsController', () => {
  let controller: AdsController;
  let service: jest.Mocked<AdsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdsController],
      providers: [
        {
          provide: AdsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            extend: jest.fn(),
            addFavorite: jest.fn(),
            removeFavorite: jest.fn(),
            findMyAds: jest.fn(),
            findMyFavorites: jest.fn(),
            findCategories: jest.fn(),
            findCategoryProperties: jest.fn(),
            trackPhoneClick: jest.fn(),
            trackWhatsappClick: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdsController>(AdsController);
    service = module.get(AdsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── Public endpoints ──────────────────────────────────────────────────────

  describe('GET /ads', () => {
    it('service.findAll çağırmalı', async () => {
      service.findAll.mockResolvedValue({ ads: [], meta: {} as any });
      const dto = { page: 1, limit: 10 };

      const result = await controller.findAll(dto);

      expect(service.findAll).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ ads: [], meta: {} });
    });
  });

  describe('GET /ads/categories', () => {
    it('kategorileri döndürmeli', async () => {
      service.findCategories.mockResolvedValue([]);

      const result = await controller.getCategories();

      expect(result).toEqual({ categories: [] });
    });

    it('parent_id parametresiyle çağırabilmeli', async () => {
      service.findCategories.mockResolvedValue([]);

      await controller.getCategories('parent-uuid');

      expect(service.findCategories).toHaveBeenCalledWith('parent-uuid');
    });
  });

  describe('GET /ads/categories/:id/properties', () => {
    it('kategori özelliklerini döndürmeli', async () => {
      const mockData = { category: {}, properties: [] };
      service.findCategoryProperties.mockResolvedValue(mockData as any);

      const result = await controller.getCategoryProperties('cat-1');

      expect(service.findCategoryProperties).toHaveBeenCalledWith('cat-1');
      expect(result).toBe(mockData);
    });
  });

  describe('GET /ads/:id', () => {
    it('ilan detayını döndürmeli', async () => {
      const ad = { id: 'ad-1', title: 'Test' };
      service.findOne.mockResolvedValue(ad as any);

      const result = await controller.findOne('ad-1');

      expect(result).toEqual({ ad });
    });
  });

  describe('POST /ads/:id/track-phone', () => {
    it('telefon numarasını döndürmeli', async () => {
      service.trackPhoneClick.mockResolvedValue({ phone: '05551234567' });

      const result = await controller.trackPhone('ad-1');

      expect(result.phone).toBe('05551234567');
    });
  });

  describe('POST /ads/:id/track-whatsapp', () => {
    it('whatsapp URL döndürmeli', async () => {
      service.trackWhatsappClick.mockResolvedValue({ whatsapp_url: 'https://wa.me/905551234567' });

      const result = await controller.trackWhatsapp('ad-1');

      expect(result.whatsapp_url).toContain('wa.me');
    });
  });

  // ── Authenticated endpoints ───────────────────────────────────────────────

  describe('POST /ads', () => {
    it('ilan oluşturmalı', async () => {
      const responseData = { ad: { id: 'new', status: 'pending' } };
      service.create.mockResolvedValue(responseData as any);

      const dto = {
        category_id: 'cat-1',
        title: 'Yeni İlan',
        description: 'Açıklama metni burada yer alır',
        price: 1000,
        contact_phone: '05551234567',
        image_ids: ['img-1'],
        cover_image_id: 'img-1',
      };

      const result = await controller.create(mockUser, dto);

      expect(service.create).toHaveBeenCalledWith(mockUser.id, dto);
      expect(result).toBe(responseData);
    });
  });

  describe('PATCH /ads/:id', () => {
    it('ilanı güncellemeli', async () => {
      const ad = { id: 'ad-1', title: 'Güncel' };
      service.update.mockResolvedValue(ad as any);

      const result = await controller.update('ad-1', mockUser, { title: 'Güncel' });

      expect(service.update).toHaveBeenCalledWith('ad-1', mockUser.id, { title: 'Güncel' });
      expect(result).toEqual({ ad });
    });
  });

  describe('DELETE /ads/:id', () => {
    it('ilanı silmeli', async () => {
      service.remove.mockResolvedValue({ message: 'İlan silindi' });

      const result = await controller.remove('ad-1', mockUser);

      expect(service.remove).toHaveBeenCalledWith('ad-1', mockUser.id);
      expect(result.message).toBe('İlan silindi');
    });
  });

  describe('POST /ads/:id/extend', () => {
    it('ilanı uzatmalı', async () => {
      const extendResult = {
        ad: { id: 'ad-1', extension_count: 1, remaining_extensions: 2 },
        message: 'İlanınız 3 gün uzatıldı',
      };
      service.extend.mockResolvedValue(extendResult as any);

      const result = await controller.extend('ad-1', mockUser, { ads_watched: 3 });

      expect(service.extend).toHaveBeenCalledWith('ad-1', mockUser.id, { ads_watched: 3 });
      expect(result.message).toContain('uzatıldı');
    });
  });

  describe('POST /ads/:id/favorite', () => {
    it('favoriye eklemeli', async () => {
      service.addFavorite.mockResolvedValue({ message: 'Favorilere eklendi' });

      const result = await controller.addFavorite('ad-1', mockUser);

      expect(service.addFavorite).toHaveBeenCalledWith('ad-1', mockUser.id);
      expect(result.message).toBe('Favorilere eklendi');
    });
  });

  describe('DELETE /ads/:id/favorite', () => {
    it('favoriden kaldırmalı', async () => {
      service.removeFavorite.mockResolvedValue({ message: 'Favorilerden çıkarıldı' });

      const result = await controller.removeFavorite('ad-1', mockUser);

      expect(result.message).toBe('Favorilerden çıkarıldı');
    });
  });

  // ── User-scoped endpoints ─────────────────────────────────────────────────

  describe('GET /users/me/ads', () => {
    it('kullanıcının ilanlarını döndürmeli', async () => {
      service.findMyAds.mockResolvedValue({ ads: [], meta: {} as any });

      const result = await controller.findMyAds(mockUser, { page: 1, limit: 20 });

      expect(service.findMyAds).toHaveBeenCalledWith(mockUser.id, { page: 1, limit: 20 });
      expect(result.ads).toEqual([]);
    });
  });

  describe('GET /users/me/favorites', () => {
    it('kullanıcının favorilerini döndürmeli', async () => {
      service.findMyFavorites.mockResolvedValue({ favorites: [] });

      const result = await controller.findMyFavorites(mockUser);

      expect(service.findMyFavorites).toHaveBeenCalledWith(mockUser.id);
      expect(result.favorites).toEqual([]);
    });
  });
});
