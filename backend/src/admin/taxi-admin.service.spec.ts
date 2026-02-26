import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaxiAdminService } from './taxi-admin.service';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TaxiAdminService', () => {
  let service: TaxiAdminService;
  let mockRepo: any;

  const mockDriver = {
    id: 'driver-1',
    name: 'Ahmet Yılmaz',
    phone: '5551234567',
    plaka: '34ABC123',
    vehicle_info: 'Toyota Corolla 2020',
    registration_file_id: 'file-1',
    license_file_id: 'file-2',
    is_verified: true,
    is_active: true,
    total_calls: 150,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    registration_file: { cdn_url: 'https://example.com/file-1' },
    license_file: { cdn_url: 'https://example.com/file-2' },
  };

  beforeEach(async () => {
    mockRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxiAdminService,
        {
          provide: getRepositoryToken(TaxiDriver),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TaxiAdminService>(TaxiAdminService);
  });

  describe('getAdminTaxiDrivers', () => {
    it('should return list of taxi drivers with pagination', async () => {
      mockRepo.getRawMany.mockResolvedValue([
        { id: 'driver-1' },
        { id: 'driver-2' },
      ]);
      mockRepo.getMany.mockResolvedValue([mockDriver]);

      const result = await service.getAdminTaxiDrivers({
        page: 1,
        limit: 20,
      });

      expect(result.drivers).toBeDefined();
      expect(result.meta).toBeDefined();
    });

    it('should filter by search term', async () => {
      mockRepo.getRawMany.mockResolvedValue([{ id: 'driver-1' }]);
      mockRepo.getMany.mockResolvedValue([mockDriver]);

      await service.getAdminTaxiDrivers({
        search: 'Ahmet',
        page: 1,
        limit: 20,
      });

      expect(mockRepo.andWhere).toHaveBeenCalled();
    });
  });

  describe('getAdminTaxiDriver', () => {
    it('should return driver by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockDriver);

      const result = await service.getAdminTaxiDriver('driver-1');

      expect(result.driver.id).toBe('driver-1');
    });

    it('should throw NotFoundException when driver not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.getAdminTaxiDriver('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTaxiDriver', () => {
    it('should create new driver', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      mockRepo.create.mockReturnValue(mockDriver);
      mockRepo.save.mockResolvedValue(mockDriver);
      mockRepo.findOne.mockResolvedValueOnce(mockDriver);

      const dto = {
        name: 'Ahmet Yılmaz',
        phone: '5551234567',
        plaka: '34ABC123',
      };

      const result = await service.createTaxiDriver(dto);

      expect(result.driver.id).toBe('driver-1');
    });

    it('should throw BadRequestException for duplicate plaka', async () => {
      mockRepo.findOne.mockResolvedValue(mockDriver);

      const dto = {
        name: 'New Name',
        phone: '5559999999',
        plaka: '34ABC123',
      };

      await expect(service.createTaxiDriver(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateTaxiDriver', () => {
    it('should update driver', async () => {
      const updatedDriver = { ...mockDriver, name: 'Updated Name' };
      mockRepo.findOne
        .mockResolvedValueOnce(mockDriver) // Get initial driver
        .mockResolvedValueOnce(updatedDriver); // Get updated driver after save

      mockRepo.save.mockResolvedValue(updatedDriver);

      const result = await service.updateTaxiDriver('driver-1', {
        name: 'Updated Name',
      });

      expect(result.driver.name).toBe('Updated Name');
    });

    it('should throw NotFoundException when driver not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateTaxiDriver('nonexistent', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTaxiDriver', () => {
    it('should soft delete driver', async () => {
      mockRepo.findOne.mockResolvedValue(mockDriver);

      await service.deleteTaxiDriver('driver-1');

      expect(mockRepo.softDelete).toHaveBeenCalledWith('driver-1');
    });

    it('should throw NotFoundException when driver not found', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteTaxiDriver('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
