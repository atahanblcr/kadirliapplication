import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyAdminController } from './pharmacy-admin.controller';
import { PharmacyAdminService } from './pharmacy-admin.service';

describe('PharmacyAdminController', () => {
  let controller: PharmacyAdminController;
  let pharmacyAdminService: jest.Mocked<PharmacyAdminService>;

  const mockPharmacy = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Pharmacy',
    address: 'Test Address',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyAdminController],
      providers: [
        {
          provide: PharmacyAdminService,
          useValue: {
            getAdminSchedule: jest.fn().mockResolvedValue({ schedule: [] }),
            assignSchedule: jest.fn().mockResolvedValue({ schedule: {} }),
            deleteScheduleEntry: jest.fn().mockResolvedValue({ message: 'Deleted' }),
            getAdminPharmacies: jest.fn().mockResolvedValue({ pharmacies: [mockPharmacy] }),
            createPharmacy: jest.fn().mockResolvedValue({ pharmacy: mockPharmacy }),
            updatePharmacy: jest.fn().mockResolvedValue({ pharmacy: mockPharmacy }),
            deletePharmacy: jest.fn().mockResolvedValue({ message: 'Deleted' }),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmacyAdminController>(PharmacyAdminController);
    pharmacyAdminService = module.get(PharmacyAdminService) as jest.Mocked<PharmacyAdminService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAdminSchedule', () => {
    it('should return pharmacy schedule', async () => {
      const result = await controller.getAdminSchedule('2026-02-27', '2026-03-27');
      expect(result.schedule).toBeDefined();
      expect(pharmacyAdminService.getAdminSchedule).toHaveBeenCalledWith('2026-02-27', '2026-03-27');
    });
  });

  describe('assignSchedule', () => {
    it('should assign pharmacy schedule', async () => {
      const dto = { pharmacy_id: mockPharmacy.id, date: '2026-02-27' };
      const result = await controller.assignSchedule(dto);
      expect(result.schedule).toBeDefined();
      expect(pharmacyAdminService.assignSchedule).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteScheduleEntry', () => {
    it('should delete schedule entry', async () => {
      const result = await controller.deleteScheduleEntry('schedule-1');
      expect(result.message).toBeDefined();
    });
  });

  describe('getAdminPharmacies', () => {
    it('should return list of pharmacies', async () => {
      const result = await controller.getAdminPharmacies('test');
      expect(result.pharmacies).toBeDefined();
      expect(pharmacyAdminService.getAdminPharmacies).toHaveBeenCalledWith('test');
    });
  });

  describe('createPharmacy', () => {
    it('should create a pharmacy', async () => {
      const dto = { name: 'New Pharmacy', address: 'New Address' };
      const result = await controller.createPharmacy(dto);
      expect(result.pharmacy).toBeDefined();
      expect(pharmacyAdminService.createPharmacy).toHaveBeenCalledWith(dto);
    });
  });

  describe('updatePharmacy', () => {
    it('should update a pharmacy', async () => {
      const dto = { name: 'Updated Pharmacy' };
      const result = await controller.updatePharmacy(mockPharmacy.id, dto);
      expect(result.pharmacy).toBeDefined();
      expect(pharmacyAdminService.updatePharmacy).toHaveBeenCalledWith(mockPharmacy.id, dto);
    });
  });

  describe('deletePharmacy', () => {
    it('should delete a pharmacy', async () => {
      const result = await controller.deletePharmacy(mockPharmacy.id);
      expect(result.message).toBeDefined();
      expect(pharmacyAdminService.deletePharmacy).toHaveBeenCalledWith(mockPharmacy.id);
    });
  });
});
