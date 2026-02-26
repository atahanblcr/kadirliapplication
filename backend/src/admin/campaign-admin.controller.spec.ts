import { Test, TestingModule } from '@nestjs/testing';
import { CampaignAdminController } from './campaign-admin.controller';
import { CampaignAdminService } from './campaign-admin.service';

describe('CampaignAdminController', () => {
  let controller: CampaignAdminController;
  let campaignAdminService: jest.Mocked<CampaignAdminService>;

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
          provide: CampaignAdminService,
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
    campaignAdminService = module.get(CampaignAdminService) as jest.Mocked<CampaignAdminService>;
  });

  describe('getAdminBusinesses', () => {
    it('should return list of businesses', async () => {
      campaignAdminService.getAdminBusinesses.mockResolvedValue({
        success: true,
        data: [mockBusiness],
      });

      const result = await controller.getAdminBusinesses();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([mockBusiness]);
      expect(campaignAdminService.getAdminBusinesses).toHaveBeenCalled();
    });
  });

  describe('getBusinessCategories', () => {
    it('should return business categories', async () => {
      campaignAdminService.getBusinessCategories.mockResolvedValue({
        success: true,
        data: [mockBusinessCategory],
      });

      const result = await controller.getBusinessCategories();

      expect(result.success).toBe(true);
      expect(campaignAdminService.getBusinessCategories).toHaveBeenCalled();
    });
  });

  describe('createBusinessCategory', () => {
    it('should create a business category', async () => {
      const dto = { name: 'New Category' };
      campaignAdminService.createBusinessCategory.mockResolvedValue({
        success: true,
        data: mockBusinessCategory,
      });

      const result = await controller.createBusinessCategory(dto);

      expect(result.success).toBe(true);
      expect(campaignAdminService.createBusinessCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('createAdminBusiness', () => {
    it('should create a business', async () => {
      const dto = { name: 'New Business', category_id: mockBusinessCategory.id };
      campaignAdminService.createAdminBusiness.mockResolvedValue({
        success: true,
        data: mockBusiness,
      });

      const result = await controller.createAdminBusiness(dto);

      expect(result.success).toBe(true);
      expect(campaignAdminService.createAdminBusiness).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAdminCampaigns', () => {
    it('should return list of campaigns', async () => {
      const dto = { status: 'active' };
      campaignAdminService.getAdminCampaigns.mockResolvedValue({
        success: true,
        data: [mockCampaign],
      });

      const result = await controller.getAdminCampaigns(dto);

      expect(result.success).toBe(true);
      expect(campaignAdminService.getAdminCampaigns).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAdminCampaignDetail', () => {
    it('should return campaign details', async () => {
      campaignAdminService.getAdminCampaignDetail.mockResolvedValue({
        success: true,
        data: mockCampaign,
      });

      const result = await controller.getAdminCampaignDetail(mockCampaign.id);

      expect(result.success).toBe(true);
      expect(campaignAdminService.getAdminCampaignDetail).toHaveBeenCalledWith(mockCampaign.id);
    });
  });

  describe('createAdminCampaign', () => {
    it('should create a campaign', async () => {
      const dto = { title: 'New Campaign', description: 'Description' };
      const adminId = 'admin-123';
      campaignAdminService.createAdminCampaign.mockResolvedValue({
        success: true,
        data: mockCampaign,
      });

      const result = await controller.createAdminCampaign(adminId, dto);

      expect(result.success).toBe(true);
      expect(campaignAdminService.createAdminCampaign).toHaveBeenCalledWith(adminId, dto);
    });
  });

  describe('updateAdminCampaign', () => {
    it('should update a campaign', async () => {
      const dto = { title: 'Updated Campaign' };
      campaignAdminService.updateAdminCampaign.mockResolvedValue({
        success: true,
        data: { ...mockCampaign, title: 'Updated Campaign' },
      });

      const result = await controller.updateAdminCampaign(mockCampaign.id, dto);

      expect(result.success).toBe(true);
      expect(campaignAdminService.updateAdminCampaign).toHaveBeenCalledWith(mockCampaign.id, dto);
    });
  });

  describe('deleteAdminCampaign', () => {
    it('should delete a campaign', async () => {
      campaignAdminService.deleteAdminCampaign.mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await controller.deleteAdminCampaign(mockCampaign.id);

      expect(result.success).toBe(true);
      expect(campaignAdminService.deleteAdminCampaign).toHaveBeenCalledWith(mockCampaign.id);
    });
  });
});
