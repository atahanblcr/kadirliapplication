import { Test, TestingModule } from '@nestjs/testing';
import { StaffAdminController } from './staff-admin.controller';
import { StaffAdminService } from './staff-admin.service';

describe('StaffAdminController', () => {
  let controller: StaffAdminController;
  let staffAdminService: jest.Mocked<StaffAdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffAdminController],
      providers: [
        {
          provide: StaffAdminService,
          useValue: {
            getStaffList: jest.fn(),
            getStaffDetail: jest.fn(),
            createStaff: jest.fn(),
            updateStaff: jest.fn(),
            updateStaffPermissions: jest.fn(),
            deactivateStaff: jest.fn(),
            resetStaffPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StaffAdminController>(StaffAdminController);
    staffAdminService = module.get(StaffAdminService) as jest.Mocked<StaffAdminService>;
  });

  describe('getStaffList', () => {
    it('should return list of staff members', async () => {
      const requestingUserId = 'admin-123';
      const dto = { search: 'test' };
      staffAdminService.getStaffList.mockResolvedValue({ success: true, data: [] });
      const result = await controller.getStaffList(requestingUserId, dto);
      expect(staffAdminService.getStaffList).toHaveBeenCalledWith(
        requestingUserId,
        dto,
      );
    });
  });

  describe('getStaffDetail', () => {
    it('should return staff member details', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      staffAdminService.getStaffDetail.mockResolvedValue({ success: true, data: {} });
      const result = await controller.getStaffDetail(id);
      expect(staffAdminService.getStaffDetail).toHaveBeenCalledWith(id);
    });
  });

  describe('createStaff', () => {
    it('should create a staff member', async () => {
      const requestingUserId = 'admin-123';
      const dto = { name: 'New Staff', email: 'staff@test.com' };
      staffAdminService.createStaff.mockResolvedValue({ success: true, data: {} });
      const result = await controller.createStaff(requestingUserId, dto);
      expect(staffAdminService.createStaff).toHaveBeenCalledWith(
        requestingUserId,
        dto,
      );
    });
  });

  describe('updateStaff', () => {
    it('should update a staff member', async () => {
      const requestingUserId = 'admin-123';
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated Staff' };
      staffAdminService.updateStaff.mockResolvedValue({ success: true, data: {} });
      const result = await controller.updateStaff(requestingUserId, id, dto);
      expect(staffAdminService.updateStaff).toHaveBeenCalledWith(
        requestingUserId,
        id,
        dto,
      );
    });
  });

  describe('updateStaffPermissions', () => {
    it('should update staff permissions', async () => {
      const requestingUserId = 'admin-123';
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { permissions: ['read_users', 'edit_users'] };
      staffAdminService.updateStaffPermissions.mockResolvedValue({
        success: true,
        data: {},
      });
      const result = await controller.updateStaffPermissions(
        requestingUserId,
        id,
        dto,
      );
      expect(staffAdminService.updateStaffPermissions).toHaveBeenCalledWith(
        requestingUserId,
        id,
        dto,
      );
    });
  });

  describe('deleteStaff', () => {
    it('should delete/deactivate a staff member', async () => {
      const requestingUserId = 'admin-123';
      const id = '123e4567-e89b-12d3-a456-426614174000';
      staffAdminService.deactivateStaff.mockResolvedValue(undefined);
      await controller.deleteStaff(requestingUserId, id);
      expect(staffAdminService.deactivateStaff).toHaveBeenCalledWith(
        requestingUserId,
        id,
      );
    });
  });

  describe('resetStaffPassword', () => {
    it('should reset staff password', async () => {
      const requestingUserId = 'admin-123';
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { new_password: 'NewPassword123' };
      staffAdminService.resetStaffPassword.mockResolvedValue({
        success: true,
        data: {},
      });
      const result = await controller.resetStaffPassword(requestingUserId, id, dto);
      expect(staffAdminService.resetStaffPassword).toHaveBeenCalledWith(
        requestingUserId,
        id,
        dto,
      );
    });
  });
});
