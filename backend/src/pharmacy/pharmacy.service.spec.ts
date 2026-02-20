import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeQb(data: any = null) {
  const qb: any = {};
  const chain = ['leftJoinAndSelect', 'where', 'andWhere', 'orderBy'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getOne = jest.fn().mockResolvedValue(data);
  qb.getMany = jest.fn().mockResolvedValue(data ?? []);
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makePharmacy = (overrides: Partial<Pharmacy> = {}): Pharmacy =>
  ({
    id: 'pharma-uuid-1',
    name: 'Merkez Eczanesi',
    address: 'Atatürk Cad. No:45',
    phone: '03283211234',
    latitude: 37.3667,
    longitude: 36.1,
    working_hours: '08:30-19:00',
    pharmacist_name: 'Ecz. Ali YILMAZ',
    is_active: true,
    ...overrides,
  } as Pharmacy);

const makeSchedule = (overrides: Partial<PharmacySchedule> = {}): PharmacySchedule =>
  ({
    id: 'sched-uuid-1',
    pharmacy_id: 'pharma-uuid-1',
    pharmacy: makePharmacy(),
    duty_date: '2026-02-20',
    start_time: '19:00',
    end_time: '09:00',
    source: 'manual',
    created_at: new Date('2026-02-20'),
    ...overrides,
  } as PharmacySchedule);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('PharmacyService', () => {
  let service: PharmacyService;
  let pharmacyRepo: any;
  let scheduleRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      find: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyService,
        { provide: getRepositoryToken(Pharmacy), useFactory: mockRepo },
        { provide: getRepositoryToken(PharmacySchedule), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<PharmacyService>(PharmacyService);
    pharmacyRepo = module.get(getRepositoryToken(Pharmacy));
    scheduleRepo = module.get(getRepositoryToken(PharmacySchedule));
  });

  afterEach(() => jest.clearAllMocks());

  // ── getCurrent ────────────────────────────────────────────────────────────

  describe('getCurrent', () => {
    it('bugünkü nöbetçi eczaneyi döndürmeli', async () => {
      const schedule = makeSchedule();
      const qb = makeQb(schedule);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getCurrent();

      expect(result.pharmacy.id).toBe('pharma-uuid-1');
      expect(result.pharmacy.name).toBe('Merkez Eczanesi');
      expect(result.pharmacy.phone).toBe('03283211234');
    });

    it('duty_hours formatı doğru olmalı (start_time - end_time)', async () => {
      const schedule = makeSchedule({ start_time: '19:00', end_time: '09:00' });
      const qb = makeQb(schedule);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getCurrent();

      expect(result.pharmacy.duty_hours).toBe('19:00 - 09:00');
    });

    it('duty_date dahil edilmeli', async () => {
      const schedule = makeSchedule({ duty_date: '2026-02-20' });
      const qb = makeQb(schedule);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getCurrent();

      expect(result.pharmacy.duty_date).toBe('2026-02-20');
    });

    it('latitude ve longitude dahil edilmeli', async () => {
      const schedule = makeSchedule();
      const qb = makeQb(schedule);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getCurrent();

      expect(result.pharmacy.latitude).toBe(37.3667);
      expect(result.pharmacy.longitude).toBe(36.1);
    });

    it('bugün nöbetçi yoksa NotFoundException fırlatmalı', async () => {
      const qb = makeQb(null);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(service.getCurrent()).rejects.toThrow(NotFoundException);
    });

    it('duty_date = TODAY ile sorgulanmalı', async () => {
      const schedule = makeSchedule();
      const qb = makeQb(schedule);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getCurrent();

      const today = new Date().toISOString().slice(0, 10);
      expect(qb.where).toHaveBeenCalledWith('s.duty_date = :today', { today });
    });

    it('birden fazla kayıt varsa ilkini döndürmeli (orderBy created_at ASC)', async () => {
      const schedule = makeSchedule();
      const qb = makeQb(schedule);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getCurrent();

      expect(qb.orderBy).toHaveBeenCalledWith('s.created_at', 'ASC');
      expect(qb.getOne).toHaveBeenCalled();
    });

    it('pharmacist_name döndürülmeli', async () => {
      const schedule = makeSchedule();
      const qb = makeQb(schedule);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getCurrent();

      expect(result.pharmacy.pharmacist_name).toBe('Ecz. Ali YILMAZ');
    });
  });

  // ── getSchedule ───────────────────────────────────────────────────────────

  describe('getSchedule', () => {
    it('takvimi döndürmeli', async () => {
      const schedules = [
        makeSchedule({ duty_date: '2026-02-16' }),
        makeSchedule({ id: 'sched-uuid-2', duty_date: '2026-02-17' }),
      ];
      const qb = makeQb(schedules);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getSchedule({});

      expect(result.schedule).toHaveLength(2);
      expect(result.schedule[0].date).toBe('2026-02-16');
      expect(result.schedule[1].date).toBe('2026-02-17');
    });

    it('her takvim kaydında pharmacy bilgisi olmalı', async () => {
      const schedules = [makeSchedule()];
      const qb = makeQb(schedules);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getSchedule({});

      expect(result.schedule[0].pharmacy.id).toBe('pharma-uuid-1');
      expect(result.schedule[0].pharmacy.name).toBe('Merkez Eczanesi');
      expect(result.schedule[0].pharmacy.phone).toBe('03283211234');
    });

    it('start_date filtresi uygulanmalı', async () => {
      const qb = makeQb([]);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getSchedule({ start_date: '2026-02-01' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        's.duty_date >= :start_date',
        { start_date: '2026-02-01' },
      );
    });

    it('end_date filtresi uygulanmalı', async () => {
      const qb = makeQb([]);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getSchedule({ end_date: '2026-02-28' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        's.duty_date <= :end_date',
        { end_date: '2026-02-28' },
      );
    });

    it('filtre yoksa andWhere çağrılmamalı', async () => {
      const qb = makeQb([]);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getSchedule({});

      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('tarihe göre artan sıralanmalı (ASC)', async () => {
      const qb = makeQb([]);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getSchedule({});

      expect(qb.orderBy).toHaveBeenCalledWith('s.duty_date', 'ASC');
    });

    it('kayıt yoksa boş array döndürmeli', async () => {
      const qb = makeQb([]);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getSchedule({});

      expect(result.schedule).toEqual([]);
    });

    it('hem start_date hem end_date birlikte kullanılabilmeli', async () => {
      const qb = makeQb([]);
      scheduleRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getSchedule({ start_date: '2026-02-01', end_date: '2026-02-28' });

      expect(qb.andWhere).toHaveBeenCalledTimes(2);
    });
  });

  // ── getList ───────────────────────────────────────────────────────────────

  describe('getList', () => {
    it('aktif eczaneleri isim sırasıyla döndürmeli', async () => {
      const pharmacies = [makePharmacy(), makePharmacy({ id: 'p-2', name: 'Yeni Eczane' })];
      pharmacyRepo.find.mockResolvedValue(pharmacies);

      const result = await service.getList();

      expect(result.pharmacies).toEqual(pharmacies);
      expect(pharmacyRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: { name: 'ASC' },
      });
    });

    it('eczane yoksa boş array döndürmeli', async () => {
      pharmacyRepo.find.mockResolvedValue([]);

      const result = await service.getList();

      expect(result.pharmacies).toEqual([]);
    });
  });
});
