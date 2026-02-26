import { Test, TestingModule } from '@nestjs/testing';
import { GuideAdminController } from './guide-admin.controller';
import { GuideAdminService } from './guide-admin.service';

describe('GuideAdminController', () => {
  let controller: GuideAdminController;
  let guideAdminService: jest.Mocked<GuideAdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuideAdminController],
      providers: [
        {
          provide: GuideAdminService,
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
    guideAdminService = module.get(GuideAdminService) as jest.Mocked<GuideAdminService>;
  });

  describe('getGuideCategories', () => {
    it('should return guide categories', () => {
      guideAdminService.getGuideCategories.mockReturnValue({ success: true, data: [] });
      const result = controller.getGuideCategories();
      expect(result.success).toBe(true);
      expect(guideAdminService.getGuideCategories).toHaveBeenCalled();
    });
  });

  describe('createGuideCategory', () => {
    it('should create guide category', () => {
      const dto = { name: 'Test Category' };
      guideAdminService.createGuideCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.createGuideCategory(dto);
      expect(guideAdminService.createGuideCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateGuideCategory', () => {
    it('should update guide category', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      guideAdminService.updateGuideCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.updateGuideCategory(id, dto);
      expect(guideAdminService.updateGuideCategory).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteGuideCategory', () => {
    it('should delete guide category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      guideAdminService.deleteGuideCategory.mockResolvedValue(undefined);
      await controller.deleteGuideCategory(id);
      expect(guideAdminService.deleteGuideCategory).toHaveBeenCalledWith(id);
    });
  });

  describe('getGuideItems', () => {
    it('should return guide items', () => {
      const dto = { category_id: '123' };
      guideAdminService.getGuideItems.mockReturnValue({ success: true, data: [] });
      const result = controller.getGuideItems(dto);
      expect(guideAdminService.getGuideItems).toHaveBeenCalledWith(dto);
    });
  });

  describe('createGuideItem', () => {
    it('should create guide item', () => {
      const dto = { title: 'Test Item', category_id: '123' };
      guideAdminService.createGuideItem.mockReturnValue({ success: true, data: {} });
      const result = controller.createGuideItem(dto);
      expect(guideAdminService.createGuideItem).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateGuideItem', () => {
    it('should update guide item', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { title: 'Updated' };
      guideAdminService.updateGuideItem.mockReturnValue({ success: true, data: {} });
      const result = controller.updateGuideItem(id, dto);
      expect(guideAdminService.updateGuideItem).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteGuideItem', () => {
    it('should delete guide item', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      guideAdminService.deleteGuideItem.mockResolvedValue(undefined);
      await controller.deleteGuideItem(id);
      expect(guideAdminService.deleteGuideItem).toHaveBeenCalledWith(id);
    });
  });
});
