import { Test, TestingModule } from '@nestjs/testing';
import { TaxiController } from './taxi.controller';
import { TaxiService } from './taxi.service';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { User } from '../database/entities/user.entity';

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeDriver = (overrides: Partial<TaxiDriver> = {}): TaxiDriver =>
  ({
    id: 'driver-uuid-1',
    name: 'Mehmet Taksi',
    phone: '05331234567',
    plaka: '01 ABC 123',
    vehicle_info: 'Beyaz Renault Megane',
    total_calls: 234,
    ...overrides,
  } as TaxiDriver);

const makeUser = (): User =>
  ({
    id: 'user-uuid-1',
    phone: '05339876543',
    role: 'user',
  } as User);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('TaxiController', () => {
  let controller: TaxiController;
  let service: jest.Mocked<TaxiService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      callDriver: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxiController],
      providers: [{ provide: TaxiService, useValue: mockService }],
    }).compile();

    controller = module.get<TaxiController>(TaxiController);
    service = module.get(TaxiService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /taxi/drivers ─────────────────────────────────────────────────────

  describe('findAll', () => {
    it('şoför listesini döndürmeli', async () => {
      const drivers = [makeDriver()];
      service.findAll.mockResolvedValue({ drivers });

      const result = await controller.findAll();

      expect(result).toEqual({ drivers });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('boş liste döndürmeli (şoför yoksa)', async () => {
      service.findAll.mockResolvedValue({ drivers: [] });

      const result = await controller.findAll();

      expect(result.drivers).toEqual([]);
    });
  });

  // ── POST /taxi/drivers/:id/call ───────────────────────────────────────────

  describe('callDriver', () => {
    it('taksi çağrısı başarıyla tamamlanmalı', async () => {
      const user = makeUser();
      const driver = makeDriver();
      const expected = {
        driver: { id: driver.id, name: driver.name, phone: driver.phone },
      };
      service.callDriver.mockResolvedValue(expected);

      const result = await controller.callDriver(user, 'driver-uuid-1');

      expect(result).toEqual(expected);
      expect(service.callDriver).toHaveBeenCalledWith('user-uuid-1', 'driver-uuid-1');
    });

    it('service hatası controller üzerinden yayılmalı', async () => {
      const user = makeUser();
      service.callDriver.mockRejectedValue(new Error('Şoför bulunamadı'));

      await expect(
        controller.callDriver(user, 'nonexistent-id'),
      ).rejects.toThrow('Şoför bulunamadı');
    });
  });
});
