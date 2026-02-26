import { Test, TestingModule } from '@nestjs/testing';
import { TaxiAdminController } from './taxi-admin.controller';
import { TaxiAdminService } from './taxi-admin.service';

describe('TaxiAdminController', () => {
  let controller: TaxiAdminController;
  let taxiAdminService: jest.Mocked<TaxiAdminService>;

  const mockTaxiDriver = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Driver',
    phone: '05551234567',
    plaka: 'ABC123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxiAdminController],
      providers: [
        {
          provide: TaxiAdminService,
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
    taxiAdminService = module.get(TaxiAdminService) as jest.Mocked<TaxiAdminService>;
  });

  describe('getTaxiDrivers', () => {
    it('should return list of taxi drivers', async () => {
      const dto = { search: 'test' };
      taxiAdminService.getAdminTaxiDrivers.mockResolvedValue({
        drivers: [mockTaxiDriver],
        meta: { page: 1, limit: 20, total: 1 },
      });

      const result = await controller.getTaxiDrivers(dto);

      expect(result.drivers).toBeDefined();
      expect(taxiAdminService.getAdminTaxiDrivers).toHaveBeenCalledWith(dto);
    });
  });

  describe('getTaxiDriver', () => {
    it('should return taxi driver details', async () => {
      taxiAdminService.getAdminTaxiDriver.mockResolvedValue({
        driver: mockTaxiDriver,
      });

      const result = await controller.getTaxiDriver(mockTaxiDriver.id);

      expect(result.driver).toEqual(mockTaxiDriver);
      expect(taxiAdminService.getAdminTaxiDriver).toHaveBeenCalledWith(mockTaxiDriver.id);
    });
  });

  describe('createTaxiDriver', () => {
    it('should create a taxi driver', async () => {
      const dto = { name: 'New Driver', phone: '05551234567', plaka: 'ABC123' };
      taxiAdminService.createTaxiDriver.mockResolvedValue({
        driver: mockTaxiDriver,
      });

      const result = await controller.createTaxiDriver(dto);

      expect(result.driver).toBeDefined();
      expect(taxiAdminService.createTaxiDriver).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateTaxiDriver', () => {
    it('should update a taxi driver', async () => {
      const dto = { name: 'Updated Driver' };
      taxiAdminService.updateTaxiDriver.mockResolvedValue({
        driver: { ...mockTaxiDriver, name: 'Updated Driver' },
      });

      const result = await controller.updateTaxiDriver(mockTaxiDriver.id, dto);

      expect(result.driver).toBeDefined();
      expect(taxiAdminService.updateTaxiDriver).toHaveBeenCalledWith(mockTaxiDriver.id, dto);
    });
  });

  describe('deleteTaxiDriver', () => {
    it('should delete a taxi driver', async () => {
      taxiAdminService.deleteTaxiDriver.mockResolvedValue(undefined);

      await controller.deleteTaxiDriver(mockTaxiDriver.id);

      expect(taxiAdminService.deleteTaxiDriver).toHaveBeenCalledWith(mockTaxiDriver.id);
    });
  });
});
