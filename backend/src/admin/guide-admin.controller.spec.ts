import { Test, TestingModule } from '@nestjs/testing';
import { GuideAdminController } from './guide-admin.controller';
import { AdminService } from './admin.service';

describe('GuideAdminController', () => {
  let controller: GuideAdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuideAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getGuideCategories: jest.fn(),
            createGuideCategory: jest.fn(),
            updateGuideCategory: jest.fn(),
            deleteGuideCategory: jest.fn(),
            getGuideItems: jest.fn(),
            createGuideItem: jest.fn(),
            updateGuideItem: jest.fn(),
            deleteGuideItem: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GuideAdminController>(GuideAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getGuideCategories', () => {
    it('should return guide categories', () => {
      adminService.getGuideCategories.mockReturnValue({ success: true, data: [] });
      const result = controller.getGuideCategories();
      expect(result.success).toBe(true);
      expect(adminService.getGuideCategories).toHaveBeenCalled();
    });
  });

  describe('createGuideCategory', () => {
    it('should create guide category', () => {
      const dto = { name: 'Test Category' };
      adminService.createGuideCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.createGuideCategory(dto);
      expect(adminService.createGuideCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateGuideCategory', () => {
    it('should update guide category', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      adminService.updateGuideCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.updateGuideCategory(id, dto);
      expect(adminService.updateGuideCategory).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteGuideCategory', () => {
    it('should delete guide category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteGuideCategory.mockResolvedValue(undefined);
      await controller.deleteGuideCategory(id);
      expect(adminService.deleteGuideCategory).toHaveBeenCalledWith(id);
    });
  });

  describe('getGuideItems', () => {
    it('should return guide items', () => {
      const dto = { category_id: '123' };
      adminService.getGuideItems.mockReturnValue({ success: true, data: [] });
      const result = controller.getGuideItems(dto);
      expect(adminService.getGuideItems).toHaveBeenCalledWith(dto);
    });
  });

  describe('createGuideItem', () => {
    it('should create guide item', () => {
      const dto = { title: 'Test Item', category_id: '123' };
      adminService.createGuideItem.mockReturnValue({ success: true, data: {} });
      const result = controller.createGuideItem(dto);
      expect(adminService.createGuideItem).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateGuideItem', () => {
    it('should update guide item', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { title: 'Updated' };
      adminService.updateGuideItem.mockReturnValue({ success: true, data: {} });
      const result = controller.updateGuideItem(id, dto);
      expect(adminService.updateGuideItem).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteGuideItem', () => {
    it('should delete guide item', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deleteGuideItem.mockResolvedValue(undefined);
      await controller.deleteGuideItem(id);
      expect(adminService.deleteGuideItem).toHaveBeenCalledWith(id);
    });
  });
});
