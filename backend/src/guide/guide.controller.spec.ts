import { Test, TestingModule } from '@nestjs/testing';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('GuideController', () => {
  let controller: GuideController;
  let service: jest.Mocked<GuideService>;

  beforeEach(async () => {
    const mockService = {
      findCategories: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuideController],
      providers: [{ provide: GuideService, useValue: mockService }],
    }).compile();

    controller = module.get<GuideController>(GuideController);
    service = module.get(GuideService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /guide/categories ─────────────────────────────────────────────────

  describe('getCategories', () => {
    it('kategori listesini döndürmeli', async () => {
      const expected = {
        categories: [
          {
            id: 'cat-uuid-1',
            name: 'Muhtarlıklar',
            slug: 'muhtarliklar',
            icon: 'account_balance',
            color: '#2196F3',
            items_count: 15,
          },
        ],
      };
      service.findCategories.mockResolvedValue(expected);

      const result = await controller.getCategories();

      expect(result).toEqual(expected);
      expect(service.findCategories).toHaveBeenCalledTimes(1);
    });

    it('boş kategori listesi döndürmeli', async () => {
      service.findCategories.mockResolvedValue({ categories: [] });

      const result = await controller.getCategories();

      expect(result.categories).toEqual([]);
    });
  });

  // ── GET /guide ────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('rehber kayıtlarını döndürmeli', async () => {
      const expected = {
        items: [
          {
            id: 'item-uuid-1',
            name: 'Ali Elektrik',
            category: { id: 'cat-1', name: 'Elektrikçi', parent: { id: 'p-1', name: 'Usta & Sanayi' } },
            phone: '05331234567',
            address: 'Merkez Mah.',
            working_hours: '08:00-18:00',
          },
        ],
      };
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll({});

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('filtreleri service\'e iletmeli', async () => {
      service.findAll.mockResolvedValue({ items: [] });
      const dto = { category_id: 'cat-uuid-1', search: 'elektrik' };

      await controller.findAll(dto);

      expect(service.findAll).toHaveBeenCalledWith(dto);
    });

    it('boş liste döndürmeli', async () => {
      service.findAll.mockResolvedValue({ items: [] });

      const result = await controller.findAll({ search: 'bulunamaz' });

      expect(result.items).toEqual([]);
    });

    it('service hatası yayılmalı', async () => {
      service.findAll.mockRejectedValue(new Error('DB error'));

      await expect(controller.findAll({})).rejects.toThrow('DB error');
    });
  });
});
