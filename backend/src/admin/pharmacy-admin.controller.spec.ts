import { Test, TestingModule } from '@nestjs/testing';
import { PharmacyAdminController } from './pharmacy-admin.controller';
import { AdminService } from './admin.service';

describe('PharmacyAdminController', () => {
  let controller: PharmacyAdminController;
  let adminService: jest.Mocked<AdminService>;

  const mockPharmacy = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Pharmacy',
    address: 'Test Address',
    phone: '05551234567',
  };

  const mockSchedule = {
    id: '223e4567-e89b-12d3-a456-426614174000',
    date: '2026-02-27',
    is_on_duty: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PharmacyAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getAdminSchedule: jest.fn(),
            assignSchedule: jest.fn(),
            deleteScheduleEntry: jest.fn(),
            getAdminPharmacies: jest.fn(),
            createPharmacy: jest.fn(),
            updatePharmacy: jest.fn(),
            deletePharmacy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PharmacyAdminController>(PharmacyAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getAdminSchedule', () => {
    it('should return pharmacy schedule', async () => {
      adminService.getAdminSchedule.mockResolvedValue({
        success: true,
        data: [mockSchedule],
      });

      const result = await controller.getAdminSchedule('2026-02-27', '2026-03-27');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockSchedule]);
      expect(adminService.getAdminSchedule).toHaveBeenCalledWith(
        '2026-02-27',
        '2026-03-27',
      );
    });
  });

  describe('assignSchedule', () => {
    it('should assign pharmacy schedule', async () => {
      const dto = { pharmacy_id: mockPharmacy.id, date: '2026-02-27' };
      adminService.assignSchedule.mockResolvedValue({
        success: true,
        data: mockSchedule,
      });

      const result = await controller.assignSchedule(dto);

      expect(result.success).toBe(true);
      expect(adminService.assignSchedule).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteScheduleEntry', () => {
    it('should delete schedule entry', async () => {
      adminService.deleteScheduleEntry.mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await controller.deleteScheduleEntry(mockSchedule.id);

      expect(result.success).toBe(true);
      expect(adminService.deleteScheduleEntry).toHaveBeenCalledWith(mockSchedule.id);
    });
  });

  describe('getAdminPharmacies', () => {
    it('should return list of pharmacies', async () => {
      adminService.getAdminPharmacies.mockResolvedValue({
        success: true,
        data: [mockPharmacy],
      });

      const result = await controller.getAdminPharmacies('test');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockPharmacy]);
      expect(adminService.getAdminPharmacies).toHaveBeenCalledWith('test');
    });
  });

  describe('createPharmacy', () => {
    it('should create a pharmacy', async () => {
      const dto = { name: 'New Pharmacy', address: 'New Address', phone: '05551234567' };
      adminService.createPharmacy.mockResolvedValue({
        success: true,
        data: mockPharmacy,
      });

      const result = await controller.createPharmacy(dto);

      expect(result.success).toBe(true);
      expect(adminService.createPharmacy).toHaveBeenCalledWith(dto);
    });
  });

  describe('updatePharmacy', () => {
    it('should update a pharmacy', async () => {
      const dto = { name: 'Updated Pharmacy' };
      adminService.updatePharmacy.mockResolvedValue({
        success: true,
        data: { ...mockPharmacy, name: 'Updated Pharmacy' },
      });

      const result = await controller.updatePharmacy(mockPharmacy.id, dto);

      expect(result.success).toBe(true);
      expect(adminService.updatePharmacy).toHaveBeenCalledWith(mockPharmacy.id, dto);
    });
  });

  describe('deletePharmacy', () => {
    it('should delete a pharmacy', async () => {
      adminService.deletePharmacy.mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await controller.deletePharmacy(mockPharmacy.id);

      expect(result.success).toBe(true);
      expect(adminService.deletePharmacy).toHaveBeenCalledWith(mockPharmacy.id);
    });
  });
});
