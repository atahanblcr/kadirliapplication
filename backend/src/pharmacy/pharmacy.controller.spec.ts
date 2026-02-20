import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makePharmacyResult = () => ({
  pharmacy: {
    id: 'pharma-uuid-1',
    name: 'Merkez Eczanesi',
    address: 'Atatürk Cad. No:45',
    phone: '03283211234',
    latitude: 37.3667,
    longitude: 36.1,
    duty_date: '2026-02-20',
    duty_hours: '19:00 - 09:00',
    pharmacist_name: 'Ecz. Ali YILMAZ',
  },
});

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('PharmacyController', () => {
  let controller: PharmacyController;
  let service: jest.Mocked<PharmacyService>;

  beforeEach(async () => {
    const mockService = {
      getCurrent: jest.fn(),
      getSchedule: jest.fn(),
      getList: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyController],
      providers: [{ provide: PharmacyService, useValue: mockService }],
    }).compile();

    controller = module.get<PharmacyController>(PharmacyController);
    service = module.get(PharmacyService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /pharmacy/current ─────────────────────────────────────────────────

  describe('getCurrent', () => {
    it('bugünkü nöbetçi eczaneyi döndürmeli', async () => {
      const expected = makePharmacyResult();
      service.getCurrent.mockResolvedValue(expected);

      const result = await controller.getCurrent();

      expect(result).toEqual(expected);
      expect(service.getCurrent).toHaveBeenCalledTimes(1);
    });

    it('service hatası controller üzerinden yayılmalı', async () => {
      service.getCurrent.mockRejectedValue(new Error('Nöbetçi bulunamadı'));

      await expect(controller.getCurrent()).rejects.toThrow('Nöbetçi bulunamadı');
    });
  });

  // ── GET /pharmacy/schedule ────────────────────────────────────────────────

  describe('getSchedule', () => {
    it('nöbet takvimini döndürmeli', async () => {
      const expected = {
        schedule: [{ date: '2026-02-20', pharmacy: { id: 'p-1', name: 'Merkez', phone: '...', address: '...' } }],
      };
      service.getSchedule.mockResolvedValue(expected);

      const result = await controller.getSchedule({});

      expect(result).toEqual(expected);
      expect(service.getSchedule).toHaveBeenCalledWith({});
    });

    it('tarih filtrelerini service\'e iletmeli', async () => {
      service.getSchedule.mockResolvedValue({ schedule: [] });
      const dto = { start_date: '2026-02-01', end_date: '2026-02-28' };

      await controller.getSchedule(dto);

      expect(service.getSchedule).toHaveBeenCalledWith(dto);
    });
  });

  // ── GET /pharmacy/list ────────────────────────────────────────────────────

  describe('getList', () => {
    it('tüm aktif eczaneleri döndürmeli', async () => {
      const expected = {
        pharmacies: [{ id: 'p-1', name: 'Merkez Eczanesi', address: '...', phone: '...', latitude: 37.3667, longitude: 36.1, working_hours: '08:30-19:00', pharmacist_name: 'Ecz. Ali' }],
      };
      service.getList.mockResolvedValue(expected);

      const result = await controller.getList();

      expect(result).toEqual(expected);
      expect(service.getList).toHaveBeenCalledTimes(1);
    });

    it('boş liste döndürmeli (eczane yoksa)', async () => {
      service.getList.mockResolvedValue({ pharmacies: [] });

      const result = await controller.getList();

      expect(result.pharmacies).toEqual([]);
    });
  });
});
