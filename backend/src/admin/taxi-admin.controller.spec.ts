import { Test, TestingModule } from '@nestjs/testing';
import { TaxiAdminController } from './taxi-admin.controller';
import { AdminService } from './admin.service';

describe('TaxiAdminController', () => {
  let controller: TaxiAdminController;
  let adminService: jest.Mocked<AdminService>;

  const mockTaxiDriver = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Driver',
    phone: '05551234567',
    vehicle_plate: 'ABC123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxiAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getAdminTaxiDrivers: jest.fn(),
            getAdminTaxiDriver: jest.fn(),
            createTaxiDriver: jest.fn(),
            updateTaxiDriver: jest.fn(),
            deleteTaxiDriver: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaxiAdminController>(TaxiAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getTaxiDrivers', () => {
    it('should return list of taxi drivers', async () => {
      const dto = { search: 'test' };
      adminService.getAdminTaxiDrivers.mockResolvedValue({
        success: true,
        data: [mockTaxiDriver],
      });

      const result = await controller.getTaxiDrivers(dto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockTaxiDriver]);
      expect(adminService.getAdminTaxiDrivers).toHaveBeenCalledWith(dto);
    });
  });

  describe('getTaxiDriver', () => {
    it('should return taxi driver details', async () => {
      adminService.getAdminTaxiDriver.mockResolvedValue({
        success: true,
        data: mockTaxiDriver,
      });

      const result = await controller.getTaxiDriver(mockTaxiDriver.id);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTaxiDriver);
      expect(adminService.getAdminTaxiDriver).toHaveBeenCalledWith(mockTaxiDriver.id);
    });
  });

  describe('createTaxiDriver', () => {
    it('should create a taxi driver', async () => {
      const dto = { name: 'New Driver', phone: '05551234567', vehicle_plate: 'ABC123' };
      adminService.createTaxiDriver.mockResolvedValue({
        success: true,
        data: mockTaxiDriver,
      });

      const result = await controller.createTaxiDriver(dto);

      expect(result.success).toBe(true);
      expect(adminService.createTaxiDriver).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateTaxiDriver', () => {
    it('should update a taxi driver', async () => {
      const dto = { name: 'Updated Driver' };
      adminService.updateTaxiDriver.mockResolvedValue({
        success: true,
        data: { ...mockTaxiDriver, name: 'Updated Driver' },
      });

      const result = await controller.updateTaxiDriver(mockTaxiDriver.id, dto);

      expect(result.success).toBe(true);
      expect(adminService.updateTaxiDriver).toHaveBeenCalledWith(mockTaxiDriver.id, dto);
    });
  });

  describe('deleteTaxiDriver', () => {
    it('should delete a taxi driver', async () => {
      adminService.deleteTaxiDriver.mockResolvedValue(undefined);

      await controller.deleteTaxiDriver(mockTaxiDriver.id);

      expect(adminService.deleteTaxiDriver).toHaveBeenCalledWith(mockTaxiDriver.id);
    });
  });
});
