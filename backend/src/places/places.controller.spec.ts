import { Test, TestingModule } from '@nestjs/testing';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Place } from '../database/entities/place.entity';

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makePlace = (overrides: Partial<Place> = {}): Place =>
  ({
    id: 'place-uuid-1',
    name: 'Karatepe-Aslantaş Açıkhava Müzesi',
    is_free: false,
    entrance_fee: 20,
    distance_from_center: 22,
    is_active: true,
    ...overrides,
  } as Place);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('PlacesController', () => {
  let controller: PlacesController;
  let service: jest.Mocked<PlacesService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesController],
      providers: [{ provide: PlacesService, useValue: mockService }],
    }).compile();

    controller = module.get<PlacesController>(PlacesController);
    service = module.get(PlacesService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /places ───────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('mekan listesini döndürmeli', async () => {
      const expected = { places: [{ id: 'place-uuid-1', name: 'Karatepe', user_distance: null }] };
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll({});

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('tüm filtreleri service\'e iletmeli', async () => {
      service.findAll.mockResolvedValue({ places: [] });
      const dto = {
        category_id: 'cat-1',
        is_free: true,
        sort: 'distance' as const,
        user_lat: 37.3667,
        user_lng: 36.1,
      };

      await controller.findAll(dto);

      expect(service.findAll).toHaveBeenCalledWith(dto);
    });

    it('boş liste döndürmeli', async () => {
      service.findAll.mockResolvedValue({ places: [] });

      const result = await controller.findAll({});

      expect(result.places).toEqual([]);
    });

    it('user koordinatlarıyla service\'e iletmeli', async () => {
      service.findAll.mockResolvedValue({ places: [] });
      const dto = { user_lat: 37.3667, user_lng: 36.1 };

      await controller.findAll(dto);

      expect(service.findAll).toHaveBeenCalledWith(dto);
    });
  });

  // ── GET /places/:id ───────────────────────────────────────────────────────

  describe('findOne', () => {
    it('mekan detayını döndürmeli', async () => {
      const place = makePlace();
      const expected = { place };
      service.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('place-uuid-1');

      expect(result).toEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith('place-uuid-1');
    });

    it('service hatası yayılmalı', async () => {
      service.findOne.mockRejectedValue(new Error('Mekan bulunamadı'));

      await expect(controller.findOne('nonexistent')).rejects.toThrow(
        'Mekan bulunamadı',
      );
    });
  });
});
