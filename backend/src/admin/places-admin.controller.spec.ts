import { Test, TestingModule } from '@nestjs/testing';
import { PlacesAdminController } from './places-admin.controller';
import { PlacesAdminService } from './places-admin.service';

describe('PlacesAdminController', () => {
  let controller: PlacesAdminController;
  let placesAdminService: jest.Mocked<PlacesAdminService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlacesAdminController],
      providers: [
        {
          provide: PlacesAdminService,
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
    placesAdminService = module.get(PlacesAdminService) as jest.Mocked<PlacesAdminService>;
  });

  describe('getPlaceCategories', () => {
    it('should return place categories', () => {
      placesAdminService.getPlaceCategories.mockReturnValue({ success: true, data: [] });
      const result = controller.getPlaceCategories();
      expect(result.success).toBe(true);
      expect(placesAdminService.getPlaceCategories).toHaveBeenCalled();
    });
  });

  describe('createPlaceCategory', () => {
    it('should create place category', () => {
      const dto = { name: 'Restaurant' };
      placesAdminService.createPlaceCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.createPlaceCategory(dto);
      expect(placesAdminService.createPlaceCategory).toHaveBeenCalledWith(dto);
    });
  });

  describe('updatePlaceCategory', () => {
    it('should update place category', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      placesAdminService.updatePlaceCategory.mockReturnValue({ success: true, data: {} });
      const result = controller.updatePlaceCategory(id, dto);
      expect(placesAdminService.updatePlaceCategory).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deletePlaceCategory', () => {
    it('should delete place category', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      placesAdminService.deletePlaceCategory.mockResolvedValue(undefined);
      await controller.deletePlaceCategory(id);
      expect(placesAdminService.deletePlaceCategory).toHaveBeenCalledWith(id);
    });
  });

  describe('getPlaces', () => {
    it('should return places list', () => {
      const dto = { search: 'test' };
      placesAdminService.getAdminPlaces.mockReturnValue({ success: true, data: [] });
      const result = controller.getPlaces(dto);
      expect(placesAdminService.getAdminPlaces).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPlace', () => {
    it('should return place details', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      placesAdminService.getAdminPlace.mockReturnValue({ success: true, data: {} });
      const result = controller.getPlace(id);
      expect(placesAdminService.getAdminPlace).toHaveBeenCalledWith(id);
    });
  });

  describe('createPlace', () => {
    it('should create place', () => {
      const dto = { name: 'New Place', category_id: '123' };
      const userId = 'user-123';
      placesAdminService.createPlace.mockReturnValue({ success: true, data: {} });
      const result = controller.createPlace(dto, userId);
      expect(placesAdminService.createPlace).toHaveBeenCalledWith(dto, userId);
    });
  });

  describe('updatePlace', () => {
    it('should update place', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { name: 'Updated' };
      placesAdminService.updatePlace.mockReturnValue({ success: true, data: {} });
      const result = controller.updatePlace(id, dto);
      expect(placesAdminService.updatePlace).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deletePlace', () => {
    it('should delete place', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      placesAdminService.deletePlace.mockResolvedValue(undefined);
      await controller.deletePlace(id);
      expect(placesAdminService.deletePlace).toHaveBeenCalledWith(id);
    });
  });

  describe('addPlaceImages', () => {
    it('should add place images', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { file_ids: ['file-1'] };
      placesAdminService.addPlaceImages.mockResolvedValue({ success: true, data: {} });
      const result = await controller.addPlaceImages(id, dto);
      expect(placesAdminService.addPlaceImages).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deletePlaceImage', () => {
    it('should delete place image', async () => {
      const imageId = '123e4567-e89b-12d3-a456-426614174000';
      placesAdminService.deletePlaceImage.mockResolvedValue(undefined);
      await controller.deletePlaceImage(imageId);
      expect(placesAdminService.deletePlaceImage).toHaveBeenCalledWith(imageId);
    });
  });

  describe('setPlaceCoverImage', () => {
    it('should set place cover image', async () => {
      const imageId = '123e4567-e89b-12d3-a456-426614174000';
      placesAdminService.setPlaceCoverImage.mockResolvedValue({ success: true, data: {} });
      const result = await controller.setPlaceCoverImage(imageId);
      expect(placesAdminService.setPlaceCoverImage).toHaveBeenCalledWith(imageId);
    });
  });

  describe('reorderPlaceImages', () => {
    it('should reorder place images', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { ordered_image_ids: ['img1', 'img2'] };
      placesAdminService.reorderPlaceImages.mockReturnValue({ success: true, data: {} });
      const result = controller.reorderPlaceImages(id, dto);
      expect(placesAdminService.reorderPlaceImages).toHaveBeenCalledWith(id, dto);
    });
  });
});
