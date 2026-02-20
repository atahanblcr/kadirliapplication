import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TaxiService } from './taxi.service';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { TaxiCall } from '../database/entities/taxi-call.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeSelectQb(data: any[] = []) {
  const qb: any = {};
  const chain = ['select', 'where', 'andWhere', 'orderBy'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getMany = jest.fn().mockResolvedValue(data);
  return qb;
}

function makeUpdateQb() {
  const qb: any = {};
  const chain = ['update', 'set', 'where'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.execute = jest.fn().mockResolvedValue({ affected: 1 });
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeDriver = (overrides: Partial<TaxiDriver> = {}): TaxiDriver =>
  ({
    id: 'driver-uuid-1',
    name: 'Mehmet Taksi',
    phone: '05331234567',
    plaka: '01 ABC 123',
    vehicle_info: 'Beyaz Renault Megane',
    is_verified: true,
    is_active: true,
    total_calls: 234,
    ...overrides,
  } as TaxiDriver);

const makeCall = (): TaxiCall =>
  ({
    id: 'call-uuid-1',
    passenger_id: 'user-uuid-1',
    driver_id: 'driver-uuid-1',
    called_at: new Date(),
  } as TaxiCall);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('TaxiService', () => {
  let service: TaxiService;
  let driverRepo: any;
  let callRepo: any;

  beforeEach(async () => {
    const mockDriverRepo = () => ({
      findOne: jest.fn(),
      create: jest.fn((dto: any) => dto),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const mockCallRepo = () => ({
      create: jest.fn((dto: any) => dto),
      save: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxiService,
        { provide: getRepositoryToken(TaxiDriver), useFactory: mockDriverRepo },
        { provide: getRepositoryToken(TaxiCall), useFactory: mockCallRepo },
      ],
    }).compile();

    service = module.get<TaxiService>(TaxiService);
    driverRepo = module.get(getRepositoryToken(TaxiDriver));
    callRepo = module.get(getRepositoryToken(TaxiCall));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('aktif ve onaylı sürücüleri döndürmeli', async () => {
      const drivers = [makeDriver()];
      const qb = makeSelectQb(drivers);
      driverRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll();

      expect(result.drivers).toEqual(drivers);
    });

    it('RANDOM sıralama kullanmalı (orderBy RANDOM())', async () => {
      const qb = makeSelectQb([]);
      driverRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll();

      expect(qb.orderBy).toHaveBeenCalledWith('RANDOM()');
    });

    it('sadece is_verified=true filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      driverRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll();

      expect(qb.where).toHaveBeenCalledWith(
        'driver.is_verified = :verified',
        { verified: true },
      );
    });

    it('sadece is_active=true filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      driverRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll();

      expect(qb.andWhere).toHaveBeenCalledWith(
        'driver.is_active = :active',
        { active: true },
      );
    });

    it('soft delete filtrelemeli (deleted_at IS NULL)', async () => {
      const qb = makeSelectQb([]);
      driverRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll();

      expect(qb.andWhere).toHaveBeenCalledWith('driver.deleted_at IS NULL');
    });

    it('şoför yoksa boş array döndürmeli', async () => {
      const qb = makeSelectQb([]);
      driverRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll();

      expect(result.drivers).toEqual([]);
    });

    it('birden fazla şoför varsa hepsini döndürmeli', async () => {
      const drivers = [makeDriver(), makeDriver({ id: 'driver-uuid-2', name: 'Ali Taksi' })];
      const qb = makeSelectQb(drivers);
      driverRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll();

      expect(result.drivers).toHaveLength(2);
    });
  });

  // ── callDriver ────────────────────────────────────────────────────────────

  describe('callDriver', () => {
    it('başarılı çağrıda şoför bilgilerini döndürmeli', async () => {
      const driver = makeDriver();
      driverRepo.findOne.mockResolvedValue(driver);
      callRepo.save.mockResolvedValue(makeCall());
      const updateQb = makeUpdateQb();
      driverRepo.createQueryBuilder.mockReturnValue(updateQb);

      const result = await service.callDriver('user-uuid-1', 'driver-uuid-1');

      expect(result.driver.id).toBe(driver.id);
      expect(result.driver.name).toBe(driver.name);
      expect(result.driver.phone).toBe(driver.phone);
    });

    it('taxi_calls kaydı oluşturmalı', async () => {
      const driver = makeDriver();
      driverRepo.findOne.mockResolvedValue(driver);
      callRepo.save.mockResolvedValue(makeCall());
      const updateQb = makeUpdateQb();
      driverRepo.createQueryBuilder.mockReturnValue(updateQb);

      await service.callDriver('user-uuid-1', 'driver-uuid-1');

      expect(callRepo.create).toHaveBeenCalledWith({
        passenger_id: 'user-uuid-1',
        driver_id: 'driver-uuid-1',
      });
      expect(callRepo.save).toHaveBeenCalled();
    });

    it('total_calls atomik olarak arttırılmalı', async () => {
      const driver = makeDriver();
      driverRepo.findOne.mockResolvedValue(driver);
      callRepo.save.mockResolvedValue(makeCall());
      const updateQb = makeUpdateQb();
      driverRepo.createQueryBuilder.mockReturnValue(updateQb);

      await service.callDriver('user-uuid-1', 'driver-uuid-1');

      expect(updateQb.set).toHaveBeenCalledWith({
        total_calls: expect.any(Function),
      });
      expect(updateQb.where).toHaveBeenCalledWith('id = :id', { id: 'driver-uuid-1' });
      expect(updateQb.execute).toHaveBeenCalled();
    });

    it('şoför bulunamazsa NotFoundException fırlatmalı', async () => {
      driverRepo.findOne.mockResolvedValue(null);

      await expect(
        service.callDriver('user-uuid-1', 'nonexistent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('is_verified=false şoför için NotFoundException fırlatmalı', async () => {
      driverRepo.findOne.mockResolvedValue(null); // where koşulu karşılanmıyor

      await expect(
        service.callDriver('user-uuid-1', 'driver-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('is_active=false şoför için NotFoundException fırlatmalı', async () => {
      driverRepo.findOne.mockResolvedValue(null); // where koşulu karşılanmıyor

      await expect(
        service.callDriver('user-uuid-1', 'driver-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('findOne doğru koşullarla çağrılmalı', async () => {
      const driver = makeDriver();
      driverRepo.findOne.mockResolvedValue(driver);
      callRepo.save.mockResolvedValue(makeCall());
      const updateQb = makeUpdateQb();
      driverRepo.createQueryBuilder.mockReturnValue(updateQb);

      await service.callDriver('user-uuid-1', 'driver-uuid-1');

      expect(driverRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: 'driver-uuid-1',
          is_verified: true,
          is_active: true,
        },
      });
    });
  });
});
