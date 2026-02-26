import { Test, TestingModule } from '@nestjs/testing';
import { CampaignAdminController } from './campaign-admin.controller';
import { AdminService } from './admin.service';

describe('CampaignAdminController', () => {
  let controller: CampaignAdminController;
  let adminService: jest.Mocked<AdminService>;

  const mockCampaign = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Campaign',
    description: 'Test Description',
    status: 'active',
  };

  const mockBusiness = {
    id: '223e4567-e89b-12d3-a456-426614174000',
    name: 'Test Business',
    category_id: '323e4567-e89b-12d3-a456-426614174000',
  };

  const mockBusinessCategory = {
    id: '323e4567-e89b-12d3-a456-426614174000',
    name: 'Test Category',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CampaignAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getAdminBusinesses: jest.fn(),
            getBusinessCategories: jest.fn(),
            createBusinessCategory: jest.fn(),
            createAdminBusiness: jest.fn(),
            getAdminCampaigns: jest.fn(),
            getAdminCampaignDetail: jest.fn(),
            createAdminCampaign: jest.fn(),
            updateAdminCampaign: jest.fn(),
            deleteAdminCampaign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CampaignAdminController>(CampaignAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getAdminBusinesses', () => {
    it('should return list of businesses', async () => {
      adminService.getAdminBusinesses.mockResolvedValue({
        success: true,
        data: [mockBusiness],
      });

      const result = await controller.getAdminBusinesses();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockBusiness]);
      expect(adminService.getAdminBusinesses).toHaveBeenCalled();
    });
  });

  describe('getBusinessCategories', () => {
    it('should return business categories', async () => {
      adminService.getBusinessCategories.mockResolvedValue({
        success: true,
        data: [mockBusinessCategory],
      });

      const result = await controller.getBusinessCategories();

      expect(result.success).toBe(true);
      expect(adminService.getBusinessCategories).toHaveBeenCalled();
    });
  });

  describe('createBusinessCategory', () => {
    it('should create a business category', async () => {
      const dto = { name: 'New Category' };
      adminService.createBusinessCategory.mockResolvedValue({
        success: true,
        data: mockBusinessCategory,
      });

      const result = await controller.createBusinessCategory(dto);

      expect(result.success).toBe(true);
      expect(adminService.createBusinessCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('createAdminBusiness', () => {
    it('should create a business', async () => {
      const dto = { name: 'New Business', category_id: mockBusinessCategory.id };
      adminService.createAdminBusiness.mockResolvedValue({
        success: true,
        data: mockBusiness,
      });

      const result = await controller.createAdminBusiness(dto);

      expect(result.success).toBe(true);
      expect(adminService.createAdminBusiness).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAdminCampaigns', () => {
    it('should return list of campaigns', async () => {
      const dto = { status: 'active' };
      adminService.getAdminCampaigns.mockResolvedValue({
        success: true,
        data: [mockCampaign],
      });

      const result = await controller.getAdminCampaigns(dto);

      expect(result.success).toBe(true);
      expect(adminService.getAdminCampaigns).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAdminCampaignDetail', () => {
    it('should return campaign details', async () => {
      adminService.getAdminCampaignDetail.mockResolvedValue({
        success: true,
        data: mockCampaign,
      });

      const result = await controller.getAdminCampaignDetail(mockCampaign.id);

      expect(result.success).toBe(true);
      expect(adminService.getAdminCampaignDetail).toHaveBeenCalledWith(mockCampaign.id);
    });
  });

  describe('createAdminCampaign', () => {
    it('should create a campaign', async () => {
      const dto = { title: 'New Campaign', description: 'Description' };
      const adminId = 'admin-123';
      adminService.createAdminCampaign.mockResolvedValue({
        success: true,
        data: mockCampaign,
      });

      const result = await controller.createAdminCampaign(adminId, dto);

      expect(result.success).toBe(true);
      expect(adminService.createAdminCampaign).toHaveBeenCalledWith(adminId, dto);
    });
  });

  describe('updateAdminCampaign', () => {
    it('should update a campaign', async () => {
      const dto = { title: 'Updated Campaign' };
      adminService.updateAdminCampaign.mockResolvedValue({
        success: true,
        data: { ...mockCampaign, title: 'Updated Campaign' },
      });

      const result = await controller.updateAdminCampaign(mockCampaign.id, dto);

      expect(result.success).toBe(true);
      expect(adminService.updateAdminCampaign).toHaveBeenCalledWith(mockCampaign.id, dto);
    });
  });

  describe('deleteAdminCampaign', () => {
    it('should delete a campaign', async () => {
      adminService.deleteAdminCampaign.mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await controller.deleteAdminCampaign(mockCampaign.id);

      expect(result.success).toBe(true);
      expect(adminService.deleteAdminCampaign).toHaveBeenCalledWith(mockCampaign.id);
    });
  });
});
