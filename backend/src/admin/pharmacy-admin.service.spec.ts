import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PharmacyAdminService } from './pharmacy-admin.service';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import { NotFoundException } from '@nestjs/common';

describe('PharmacyAdminService', () => {
  let service: PharmacyAdminService;
  let pharmacyRepo: any;
  let scheduleRepo: any;

  const mockPharmacy = { id: 'pharmacy-1', name: 'Test Pharmacy', address: 'Test Address' };
  const mockSchedule = { id: 'schedule-1', pharmacy_id: 'pharmacy-1', pharmacy: mockPharmacy, duty_date: '2026-02-27', start_time: '19:00', end_time: '09:00', source: 'manual', created_at: new Date() };

  beforeEach(async () => {
    pharmacyRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    scheduleRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PharmacyAdminService,
        { provide: getRepositoryToken(Pharmacy), useValue: pharmacyRepo },
        { provide: getRepositoryToken(PharmacySchedule), useValue: scheduleRepo },
      ],
    }).compile();

    service = module.get<PharmacyAdminService>(PharmacyAdminService);
  });

  describe('getAdminPharmacies', () => {
    it('should return pharmacies', async () => {
      pharmacyRepo.getMany.mockResolvedValue([mockPharmacy]);
      const result = await service.getAdminPharmacies();
      expect(result.pharmacies).toHaveLength(1);
    });
  });

  describe('createPharmacy', () => {
    it('should create pharmacy', async () => {
      pharmacyRepo.create.mockReturnValue(mockPharmacy);
      pharmacyRepo.save.mockResolvedValue(mockPharmacy);
      const result = await service.createPharmacy({ name: 'Test', address: 'Test' });
      expect(result.pharmacy).toBeDefined();
    });
  });

  describe('updatePharmacy', () => {
    it('should update pharmacy', async () => {
      pharmacyRepo.findOne.mockResolvedValue(mockPharmacy);
      const result = await service.updatePharmacy('pharmacy-1', { name: 'Updated' });
      expect(result.pharmacy).toBeDefined();
    });

    it('should throw NotFoundException', async () => {
      pharmacyRepo.findOne.mockResolvedValue(null);
      await expect(service.updatePharmacy('nonexistent', { name: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePharmacy', () => {
    it('should delete pharmacy', async () => {
      pharmacyRepo.findOne.mockResolvedValue(mockPharmacy);
      const result = await service.deletePharmacy('pharmacy-1');
      expect(result.message).toBeDefined();
    });
  });

  describe('getAdminSchedule', () => {
    it('should return schedules', async () => {
      scheduleRepo.getMany.mockResolvedValue([mockSchedule]);
      const result = await service.getAdminSchedule();
      expect(result.schedule).toBeDefined();
    });
  });

  describe('assignSchedule', () => {
    it('should assign schedule', async () => {
      pharmacyRepo.findOne.mockResolvedValue(mockPharmacy);
      scheduleRepo.create.mockReturnValue(mockSchedule);
      scheduleRepo.save.mockResolvedValue(mockSchedule);
      const result = await service.assignSchedule({ pharmacy_id: 'pharmacy-1', date: '2026-02-27' });
      expect(result.schedule).toBeDefined();
    });
  });

  describe('deleteScheduleEntry', () => {
    it('should delete schedule entry', async () => {
      scheduleRepo.findOne.mockResolvedValue(mockSchedule);
      const result = await service.deleteScheduleEntry('schedule-1');
      expect(result.message).toBeDefined();
    });
  });
});
