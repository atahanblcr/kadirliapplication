import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { QueryApprovalsDto } from './dto/query-approvals.dto';
import { RejectAdDto } from './dto/reject-ad.dto';
import { QueryNeighborhoodsDto } from './dto/query-neighborhoods.dto';
import { QueryAdminAdsDto } from './dto/query-admin-ads.dto';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockAdminService = {
    getDashboard: jest.fn(),
    getModuleUsage: jest.fn(),
    getRecentActivities: jest.fn(),
    getApprovals: jest.fn(),
    getAdminAds: jest.fn(),
    deleteAdAsAdmin: jest.fn(),
    approveAd: jest.fn(),
    rejectAd: jest.fn(),
    getNeighborhoods: jest.fn(),
    createNeighborhood: jest.fn(),
    updateNeighborhood: jest.fn(),
    deleteNeighborhood: jest.fn(),
    getAdminProfile: jest.fn(),
    updateAdminProfile: jest.fn(),
    changeAdminPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('should call adminService.getDashboard', async () => {
      const mockData = { users_count: 100, ads_count: 50 };
      mockAdminService.getDashboard.mockResolvedValue(mockData);

      const result = await controller.getDashboard();

      expect(result).toEqual(mockData);
      expect(service.getDashboard).toHaveBeenCalledTimes(1);
    });

    it('should handle getDashboard error', async () => {
      const error = new Error('Database error');
      mockAdminService.getDashboard.mockRejectedValue(error);

      await expect(controller.getDashboard()).rejects.toThrow('Database error');
      expect(service.getDashboard).toHaveBeenCalledTimes(1);
    });
  });

  describe('getModuleUsage', () => {
    it('should call adminService.getModuleUsage', async () => {
      const mockData = { ads: 150, users: 200 };
      mockAdminService.getModuleUsage.mockResolvedValue(mockData);

      const result = await controller.getModuleUsage();

      expect(result).toEqual(mockData);
      expect(service.getModuleUsage).toHaveBeenCalledTimes(1);
    });

    it('should return module usage statistics', async () => {
      const mockData = {
        ads: { pending: 5, approved: 100 },
        users: { active: 150, banned: 10 },
      };
      mockAdminService.getModuleUsage.mockResolvedValue(mockData);

      const result = await controller.getModuleUsage();

      expect(result.ads.pending).toBe(5);
      expect(result.users.active).toBe(150);
    });
  });

  describe('getRecentActivities', () => {
    it('should call adminService.getRecentActivities', async () => {
      const mockData = [
        { id: '1', action: 'created_ad', timestamp: new Date() },
      ];
      mockAdminService.getRecentActivities.mockResolvedValue(mockData);

      const result = await controller.getRecentActivities();

      expect(result).toEqual(mockData);
      expect(service.getRecentActivities).toHaveBeenCalledTimes(1);
    });

    it('should return activities in correct format', async () => {
      const mockActivities = [
        { id: '1', action: 'approved_ad', user: 'admin1', created_at: '2026-02-27' },
        { id: '2', action: 'banned_user', user: 'admin2', created_at: '2026-02-26' },
      ];
      mockAdminService.getRecentActivities.mockResolvedValue(mockActivities);

      const result = await controller.getRecentActivities();

      expect(result).toHaveLength(2);
      expect(result[0].action).toBe('approved_ad');
    });
  });

  describe('getApprovals', () => {
    it('should call adminService.getApprovals with dto', async () => {
      const dto: QueryApprovalsDto = { type: 'ads', page: 1 };
      const mockData = { data: [], meta: { total: 0 } };
      mockAdminService.getApprovals.mockResolvedValue(mockData);

      const result = await controller.getApprovals(dto);

      expect(result).toEqual(mockData);
      expect(service.getApprovals).toHaveBeenCalledWith(dto);
    });

    it('should pass different approval types to service', async () => {
      const mockData = { data: [], meta: { total: 0 } };
      mockAdminService.getApprovals.mockResolvedValue(mockData);

      const dto: QueryApprovalsDto = { type: 'campaigns' };
      await controller.getApprovals(dto);

      expect(service.getApprovals).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'campaigns' })
      );
    });

    it('should handle approvals with page parameter', async () => {
      const dto: QueryApprovalsDto = { type: 'events', page: 2 };
      mockAdminService.getApprovals.mockResolvedValue({ data: [], meta: { total: 0 } });

      await controller.getApprovals(dto);

      expect(service.getApprovals).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });
  });

  describe('getAds', () => {
    it('should call adminService.getAdminAds with dto', async () => {
      const dto: QueryAdminAdsDto = { status: 'pending' };
      const mockData = { data: [], meta: { total: 0 } };
      mockAdminService.getAdminAds.mockResolvedValue(mockData);

      const result = await controller.getAds(dto);

      expect(result).toEqual(mockData);
      expect(service.getAdminAds).toHaveBeenCalledWith(dto);
    });

    it('should pass status filter to service', async () => {
      const dto: QueryAdminAdsDto = { status: 'approved' };
      mockAdminService.getAdminAds.mockResolvedValue({ data: [], meta: { total: 0 } });

      await controller.getAds(dto);

      expect(service.getAdminAds).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'approved' })
      );
    });

    it('should handle multiple query parameters', async () => {
      const dto: QueryAdminAdsDto = {
        status: 'rejected',
        search: 'phone',
        page: 1,
        limit: 20,
      };
      mockAdminService.getAdminAds.mockResolvedValue({ data: [], meta: { total: 0 } });

      await controller.getAds(dto);

      expect(service.getAdminAds).toHaveBeenCalledWith(dto);
    });
  });

  describe('deleteAd', () => {
    it('should call adminService.deleteAdAsAdmin with id', async () => {
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      mockAdminService.deleteAdAsAdmin.mockResolvedValue({ success: true });

      await controller.deleteAd(adId);

      expect(service.deleteAdAsAdmin).toHaveBeenCalledWith(adId);
    });

    it('should return success response', async () => {
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      mockAdminService.deleteAdAsAdmin.mockResolvedValue(undefined);

      const result = await controller.deleteAd(adId);

      expect(result).toBeUndefined();
    });

    it('should handle non-existent ad', async () => {
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      mockAdminService.deleteAdAsAdmin.mockRejectedValue(
        new Error('Ad not found')
      );

      await expect(controller.deleteAd(adId)).rejects.toThrow('Ad not found');
    });
  });

  describe('approveAd', () => {
    it('should call adminService.approveAd with adminId and adId', async () => {
      const adminId = 'admin-123';
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      mockAdminService.approveAd.mockResolvedValue({ status: 'approved' });

      const result = await controller.approveAd(adminId, adId);

      expect(result).toEqual({ status: 'approved' });
      expect(service.approveAd).toHaveBeenCalledWith(adminId, adId);
    });

    it('should handle approval error', async () => {
      const adminId = 'admin-123';
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      mockAdminService.approveAd.mockRejectedValue(new Error('Already approved'));

      await expect(controller.approveAd(adminId, adId)).rejects.toThrow(
        'Already approved'
      );
    });

    it('should pass correct parameters to service', async () => {
      const adminId = 'admin-456';
      const adId = '789e0123-e89b-12d3-a456-426614174999';
      mockAdminService.approveAd.mockResolvedValue({ status: 'approved' });

      await controller.approveAd(adminId, adId);

      expect(service.approveAd).toHaveBeenCalledTimes(1);
      expect(service.approveAd).toHaveBeenCalledWith(adminId, adId);
    });
  });

  describe('rejectAd', () => {
    it('should call adminService.rejectAd with adminId, adId, and dto', async () => {
      const adminId = 'admin-123';
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      const dto: RejectAdDto = { reason: 'Inappropriate content' };
      mockAdminService.rejectAd.mockResolvedValue({ status: 'rejected' });

      const result = await controller.rejectAd(adminId, adId, dto);

      expect(result).toEqual({ status: 'rejected' });
      expect(service.rejectAd).toHaveBeenCalledWith(adminId, adId, dto);
    });

    it('should pass rejection reason to service', async () => {
      const adminId = 'admin-123';
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      const dto: RejectAdDto = { reason: 'Duplicate posting' };
      mockAdminService.rejectAd.mockResolvedValue({ status: 'rejected' });

      await controller.rejectAd(adminId, adId, dto);

      expect(service.rejectAd).toHaveBeenCalledWith(
        adminId,
        adId,
        expect.objectContaining({ reason: 'Duplicate posting' })
      );
    });

    it('should handle rejection error', async () => {
      const adminId = 'admin-123';
      const adId = '123e4567-e89b-12d3-a456-426614174000';
      const dto: RejectAdDto = { reason: 'Invalid' };
      mockAdminService.rejectAd.mockRejectedValue(new Error('Ad not found'));

      await expect(controller.rejectAd(adminId, adId, dto)).rejects.toThrow(
        'Ad not found'
      );
    });
  });

  // ============================================================================
  // NEIGHBORHOOD ENDPOINTS - CRITICAL QUERY PARAMETER PARSING (Lines 98-101)
  // ============================================================================

  describe('getNeighborhoods', () => {
    // ─ Line 98: const page = parseInt(dto.page ?? '1', 10);
    it('should use default page value of 1 when page is undefined', () => {
      const dto: QueryNeighborhoodsDto = { search: 'test' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        'test',
        undefined,
        undefined,
        1, // ← default page
        50
      );
    });

    it('should parse page string to integer', () => {
      const dto: QueryNeighborhoodsDto = { page: '2' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        2, // ← parsed to number
        50
      );
    });

    it('should handle page as number input', () => {
      const dto: QueryNeighborhoodsDto = { page: '5' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        5,
        50
      );
    });

    // ─ Line 99: const limit = parseInt(dto.limit ?? '50', 10);
    it('should use default limit value of 50 when limit is undefined', () => {
      const dto: QueryNeighborhoodsDto = { page: '1' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        1,
        50 // ← default limit
      );
    });

    it('should parse limit string to integer', () => {
      const dto: QueryNeighborhoodsDto = { limit: '25' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        1,
        25 // ← parsed to number
      );
    });

    it('should handle large limit values', () => {
      const dto: QueryNeighborhoodsDto = { limit: '100' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        1,
        100
      );
    });

    // ─ Line 100: const is_active = dto.is_active !== undefined ? dto.is_active === 'true' : undefined;
    // Branch 1: is_active is undefined → result is undefined
    it('should set is_active to undefined when not provided', () => {
      const dto: QueryNeighborhoodsDto = { page: '1' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined, // ← is_active undefined
        1,
        50
      );
    });

    // Branch 2a: is_active === 'true' → result is true
    it('should parse is_active=true string to boolean true', () => {
      const dto: QueryNeighborhoodsDto = { is_active: 'true' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        true, // ← parsed to boolean true
        1,
        50
      );
    });

    // Branch 2b: is_active !== 'true' → result is false
    it('should parse is_active=false string to boolean false', () => {
      const dto: QueryNeighborhoodsDto = { is_active: 'false' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        false, // ← parsed to boolean false
        1,
        50
      );
    });

    it('should handle is_active with unexpected string values', () => {
      const dto: QueryNeighborhoodsDto = { is_active: 'maybe' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        false, // ← not 'true', so false
        1,
        50
      );
    });

    // Combined query parameters - all parsing rules together
    it('should handle all query parameters together with defaults', () => {
      const dto: QueryNeighborhoodsDto = {};
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        undefined,
        undefined,
        1, // default page
        50 // default limit
      );
    });

    it('should handle all query parameters with custom values', () => {
      const dto: QueryNeighborhoodsDto = {
        search: 'merkez',
        type: 'city',
        is_active: 'true',
        page: '2',
        limit: '20',
      };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        'merkez',
        'city',
        true,
        2,
        20
      );
    });

    it('should handle mixed parameter types', () => {
      const dto: QueryNeighborhoodsDto = {
        search: 'akdam',
        page: '3',
        is_active: 'false',
      };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        'akdam',
        undefined,
        false,
        3,
        50 // default limit
      );
    });

    it('should handle search parameter', () => {
      const dto: QueryNeighborhoodsDto = { search: 'neighborhood name' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        'neighborhood name',
        undefined,
        undefined,
        1,
        50
      );
    });

    it('should handle type parameter', () => {
      const dto: QueryNeighborhoodsDto = { type: 'district' };
      mockAdminService.getNeighborhoods.mockResolvedValue({ data: [] });

      controller.getNeighborhoods(dto);

      expect(service.getNeighborhoods).toHaveBeenCalledWith(
        undefined,
        'district',
        undefined,
        1,
        50
      );
    });

    it('should return neighborhoods data', async () => {
      const mockData = {
        data: [
          { id: '1', name: 'Merkez', type: 'city', is_active: true },
        ],
        meta: { total: 1, page: 1 },
      };
      mockAdminService.getNeighborhoods.mockResolvedValue(mockData);

      const dto: QueryNeighborhoodsDto = {};
      const result = await controller.getNeighborhoods(dto);

      expect(result).toEqual(mockData);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('Merkez');
    });
  });

  describe('createNeighborhood', () => {
    it('should call adminService.createNeighborhood with dto', async () => {
      const dto: CreateNeighborhoodDto = {
        name: 'New Neighborhood',
        type: 'village',
        is_active: true,
      };
      mockAdminService.createNeighborhood.mockResolvedValue({
        id: '1',
        ...dto,
      });

      const result = await controller.createNeighborhood(dto);

      expect(service.createNeighborhood).toHaveBeenCalledWith(dto);
      expect(result.name).toBe('New Neighborhood');
    });

    it('should handle validation errors', async () => {
      const dto: CreateNeighborhoodDto = {
        name: '',
        type: 'city',
        is_active: true,
      };
      mockAdminService.createNeighborhood.mockRejectedValue(
        new Error('Validation failed')
      );

      await expect(controller.createNeighborhood(dto)).rejects.toThrow(
        'Validation failed'
      );
    });
  });

  describe('updateNeighborhood', () => {
    it('should call adminService.updateNeighborhood with id and dto', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateNeighborhoodDto = {
        name: 'Updated Name',
        is_active: false,
      };
      mockAdminService.updateNeighborhood.mockResolvedValue({ id, ...dto });

      const result = await controller.updateNeighborhood(id, dto);

      expect(service.updateNeighborhood).toHaveBeenCalledWith(id, dto);
      expect(result.name).toBe('Updated Name');
    });

    it('should handle not found error', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto: UpdateNeighborhoodDto = { name: 'Test' };
      mockAdminService.updateNeighborhood.mockRejectedValue(
        new Error('Neighborhood not found')
      );

      await expect(controller.updateNeighborhood(id, dto)).rejects.toThrow(
        'Neighborhood not found'
      );
    });
  });

  describe('deleteNeighborhood', () => {
    it('should call adminService.deleteNeighborhood with id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockAdminService.deleteNeighborhood.mockResolvedValue({ success: true });

      const result = await controller.deleteNeighborhood(id);

      expect(service.deleteNeighborhood).toHaveBeenCalledWith(id);
    });

    it('should handle delete errors', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockAdminService.deleteNeighborhood.mockRejectedValue(
        new Error('Cannot delete active neighborhood')
      );

      await expect(controller.deleteNeighborhood(id)).rejects.toThrow(
        'Cannot delete active neighborhood'
      );
    });
  });

  describe('getProfile', () => {
    it('should call adminService.getAdminProfile with user id', async () => {
      const user = { id: 'admin-123', name: 'Admin User' };
      const mockProfile = { id: user.id, email: 'admin@test.com' };
      mockAdminService.getAdminProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(user);

      expect(service.getAdminProfile).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(mockProfile);
    });

    it('should return admin profile data', async () => {
      const user = { id: 'admin-456' };
      const mockProfile = {
        id: 'admin-456',
        email: 'admin456@test.com',
        first_name: 'Admin',
        last_name: 'User',
      };
      mockAdminService.getAdminProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(user);

      expect(result.email).toBe('admin456@test.com');
      expect(result.first_name).toBe('Admin');
    });
  });

  describe('updateProfile', () => {
    it('should call adminService.updateAdminProfile with user id and dto', async () => {
      const user = { id: 'admin-123' };
      const dto: UpdateAdminProfileDto = { first_name: 'New Name' };
      mockAdminService.updateAdminProfile.mockResolvedValue({ id: user.id, ...dto });

      const result = await controller.updateProfile(user, dto);

      expect(service.updateAdminProfile).toHaveBeenCalledWith(user.id, dto);
      expect(result.first_name).toBe('New Name');
    });

    it('should handle profile update errors', async () => {
      const user = { id: 'admin-123' };
      const dto: UpdateAdminProfileDto = { email: 'invalid-email' };
      mockAdminService.updateAdminProfile.mockRejectedValue(
        new Error('Invalid email format')
      );

      await expect(controller.updateProfile(user, dto)).rejects.toThrow(
        'Invalid email format'
      );
    });

    it('should pass all profile fields to service', async () => {
      const user = { id: 'admin-789' };
      const dto: UpdateAdminProfileDto = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
      };
      mockAdminService.updateAdminProfile.mockResolvedValue({ id: user.id, ...dto });

      await controller.updateProfile(user, dto);

      expect(service.updateAdminProfile).toHaveBeenCalledWith(user.id, dto);
    });
  });

  describe('changePassword', () => {
    it('should call adminService.changeAdminPassword with user id and dto', async () => {
      const user = { id: 'admin-123' };
      const dto: ChangePasswordDto = {
        current_password: 'OldPass123!',
        new_password: 'NewPass123!',
      };
      mockAdminService.changeAdminPassword.mockResolvedValue({ success: true });

      const result = await controller.changePassword(user, dto);

      expect(service.changeAdminPassword).toHaveBeenCalledWith(user.id, dto);
      expect(result.success).toBe(true);
    });

    it('should handle incorrect current password', async () => {
      const user = { id: 'admin-123' };
      const dto: ChangePasswordDto = {
        current_password: 'WrongPassword!',
        new_password: 'NewPass123!',
      };
      mockAdminService.changeAdminPassword.mockRejectedValue(
        new Error('Current password is incorrect')
      );

      await expect(controller.changePassword(user, dto)).rejects.toThrow(
        'Current password is incorrect'
      );
    });

    it('should handle weak new password', async () => {
      const user = { id: 'admin-123' };
      const dto: ChangePasswordDto = {
        current_password: 'OldPass123!',
        new_password: 'weak',
      };
      mockAdminService.changeAdminPassword.mockRejectedValue(
        new Error('Password does not meet requirements')
      );

      await expect(controller.changePassword(user, dto)).rejects.toThrow(
        'Password does not meet requirements'
      );
    });

    it('should prevent same password reuse', async () => {
      const user = { id: 'admin-123' };
      const dto: ChangePasswordDto = {
        current_password: 'SamePass123!',
        new_password: 'SamePass123!',
      };
      mockAdminService.changeAdminPassword.mockRejectedValue(
        new Error('New password cannot be same as current password')
      );

      await expect(controller.changePassword(user, dto)).rejects.toThrow(
        'New password cannot be same as current password'
      );
    });
  });
});
