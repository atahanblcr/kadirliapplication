import { Test, TestingModule } from '@nestjs/testing';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('TransportController', () => {
  let controller: TransportController;
  let service: jest.Mocked<TransportService>;

  beforeEach(async () => {
    const mockService = {
      findIntercity: jest.fn(),
      findIntracity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportController],
      providers: [{ provide: TransportService, useValue: mockService }],
    }).compile();

    controller = module.get<TransportController>(TransportController);
    service = module.get(TransportService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /transport/intercity ───────────────────────────────────────────────

  describe('findIntercity', () => {
    it('şehir dışı hat listesini döndürmeli', async () => {
      const expected = {
        routes: [
          {
            id: 'intercity-uuid-1',
            destination: 'Adana',
            price: 150,
            duration_minutes: 90,
            company: 'Metro Turizm',
            schedules: [{ departure_time: '06:00' }],
          },
        ],
      };
      service.findIntercity.mockResolvedValue(expected);

      const result = await controller.findIntercity();

      expect(result).toEqual(expected);
      expect(service.findIntercity).toHaveBeenCalledTimes(1);
    });

    it('boş liste döndürmeli', async () => {
      service.findIntercity.mockResolvedValue({ routes: [] });

      const result = await controller.findIntercity();

      expect(result.routes).toEqual([]);
    });

    it('service hatası yayılmalı', async () => {
      service.findIntercity.mockRejectedValue(new Error('DB hatası'));

      await expect(controller.findIntercity()).rejects.toThrow('DB hatası');
    });
  });

  // ── GET /transport/intracity ───────────────────────────────────────────────

  describe('findIntracity', () => {
    it('şehir içi rota listesini döndürmeli', async () => {
      const expected = {
        routes: [
          {
            id: 'intracity-uuid-1',
            route_number: '1',
            route_name: 'Otogar - Hastane - Fakülte',
            first_departure: '06:00',
            last_departure: '22:00',
            frequency_minutes: 30,
            stops: [
              { stop_name: 'Otogar', stop_order: 1, time_from_start: 0 },
            ],
          },
        ],
      };
      service.findIntracity.mockResolvedValue(expected);

      const result = await controller.findIntracity();

      expect(result).toEqual(expected);
      expect(service.findIntracity).toHaveBeenCalledTimes(1);
    });

    it('boş liste döndürmeli', async () => {
      service.findIntracity.mockResolvedValue({ routes: [] });

      const result = await controller.findIntracity();

      expect(result.routes).toEqual([]);
    });

    it('service hatası yayılmalı', async () => {
      service.findIntracity.mockRejectedValue(new Error('DB hatası'));

      await expect(controller.findIntracity()).rejects.toThrow('DB hatası');
    });
  });
});
