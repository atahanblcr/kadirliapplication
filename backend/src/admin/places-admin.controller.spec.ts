import { Test, TestingModule } from '@nestjs/testing';
import { PlacesAdminController } from './places-admin.controller';
import { AdminService } from './admin.service';

describe('PlacesAdminController', () => {
  let controller: PlacesAdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesAdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getPlaceCategories: jest.fn(),
            createPlaceCategory: jest.fn(),
            updatePlaceCategory: jest.fn(),
            deletePlaceCategory: jest.fn(),
            getAdminPlaces: jest.fn(),
            getAdminPlace: jest.fn(),
            createPlace: jest.fn(),
            updatePlace: jest.fn(),
            deletePlace: jest.fn(),
            addPlaceImages: jest.fn(),
            deletePlaceImage: jest.fn(),
            setPlaceCoverImage: jest.fn(),
            reorderPlaceImages: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlacesAdminController>(PlacesAdminController);
    adminService = module.get(AdminService) as jest.Mocked<AdminService>;
  });

  describe('getPlaceCategories', () => {
    it('should return place categories', () => {
      adminService.getPlaceCategories.mockReturnValue({ success: true, data: [] });
      const result = controller.getPlaceCategories();
      expect(result.success).toBe(true);
      expect(adminService.getPlaceCategories).toHaveBeenCalled();
    });
  });

  describe('createPlaceCategory', () => {
    it('should create place category', () => {
      const dto = { name: 'Restaurant' };
      adminService.createPlaceCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.createPlaceCategory(dto);
      expect(adminService.createPlaceCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('updatePlaceCategory', () => {
    it('should update place category', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      adminService.updatePlaceCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.updatePlaceCategory(id, dto);
      expect(adminService.updatePlaceCategory).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deletePlaceCategory', () => {
    it('should delete place category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deletePlaceCategory.mockResolvedValue(undefined);
      await controller.deletePlaceCategory(id);
      expect(adminService.deletePlaceCategory).toHaveBeenCalledWith(id);
    });
  });

  describe('getPlaces', () => {
    it('should return places list', () => {
      const dto = { search: 'test' };
      adminService.getAdminPlaces.mockReturnValue({ success: true, data: [] });
      const result = controller.getPlaces(dto);
      expect(adminService.getAdminPlaces).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPlace', () => {
    it('should return place details', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.getAdminPlace.mockReturnValue({ success: true, data: {} });
      const result = controller.getPlace(id);
      expect(adminService.getAdminPlace).toHaveBeenCalledWith(id);
    });
  });

  describe('createPlace', () => {
    it('should create place', () => {
      const dto = { name: 'New Place', category_id: '123' };
      const userId = 'user-123';
      adminService.createPlace.mockReturnValue({ success: true, data: {} });
      const result = controller.createPlace(dto, userId);
      expect(adminService.createPlace).toHaveBeenCalledWith(dto, userId);
    });
  });

  describe('updatePlace', () => {
    it('should update place', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      adminService.updatePlace.mockReturnValue({ success: true, data: {} });
      const result = controller.updatePlace(id, dto);
      expect(adminService.updatePlace).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deletePlace', () => {
    it('should delete place', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deletePlace.mockResolvedValue(undefined);
      await controller.deletePlace(id);
      expect(adminService.deletePlace).toHaveBeenCalledWith(id);
    });
  });

  describe('addPlaceImages', () => {
    it('should add place images', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { file_ids: ['file-1'] };
      adminService.addPlaceImages.mockResolvedValue({ success: true, data: {} });
      const result = await controller.addPlaceImages(id, dto);
      expect(adminService.addPlaceImages).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deletePlaceImage', () => {
    it('should delete place image', async () => {
      const imageId = '123e4567-e89b-12d3-a456-426614174000';
      adminService.deletePlaceImage.mockResolvedValue(undefined);
      await controller.deletePlaceImage(imageId);
      expect(adminService.deletePlaceImage).toHaveBeenCalledWith(imageId);
    });
  });

  describe('setPlaceCoverImage', () => {
    it('should set place cover image', async () => {
      const imageId = '123e4567-e89b-12d3-a456-426614174000';
      adminService.setPlaceCoverImage.mockResolvedValue({ success: true, data: {} });
      const result = await controller.setPlaceCoverImage(imageId);
      expect(adminService.setPlaceCoverImage).toHaveBeenCalledWith(imageId);
    });
  });

  describe('reorderPlaceImages', () => {
    it('should reorder place images', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { ordered_image_ids: ['img1', 'img2'] };
      adminService.reorderPlaceImages.mockReturnValue({ success: true, data: {} });
      const result = controller.reorderPlaceImages(id, dto);
      expect(adminService.reorderPlaceImages).toHaveBeenCalledWith(id, dto);
    });
  });
});
