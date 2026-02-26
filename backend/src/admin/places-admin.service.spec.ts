import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlacesAdminService } from './places-admin.service';
import { Place, PlaceCategory, PlaceImage } from '../database/entities/place.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PlacesAdminService', () => {
  let service: PlacesAdminService;
  let categoryRepository: any;
  let placeRepository: any;
  let imageRepository: any;

  beforeEach(async () => {
    categoryRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    placeRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    imageRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesAdminService,
        { provide: getRepositoryToken(PlaceCategory), useValue: categoryRepository },
        { provide: getRepositoryToken(Place), useValue: placeRepository },
        { provide: getRepositoryToken(PlaceImage), useValue: imageRepository },
      ],
    }).compile();

    service = module.get<PlacesAdminService>(PlacesAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================================================
  // getPlaceCategories Tests
  // ============================================================================
  describe('getPlaceCategories', () => {
    it('should return all place categories sorted', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Historical', slug: 'historical', icon: '🏛️', display_order: 1, is_active: true },
        { id: 'cat-2', name: 'Nature', slug: 'nature', icon: '🌲', display_order: 2, is_active: true },
      ];

      categoryRepository.find.mockResolvedValueOnce(mockCategories);

      const result = await service.getPlaceCategories();

      expect(result.categories).toHaveLength(2);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        order: { display_order: 'ASC', name: 'ASC' },
      });
    });

    it('should return empty array when no categories exist', async () => {
      categoryRepository.find.mockResolvedValueOnce([]);

      const result = await service.getPlaceCategories();

      expect(result.categories).toEqual([]);
    });
  });

  // ============================================================================
  // createPlaceCategory Tests
  // ============================================================================
  describe('createPlaceCategory', () => {
    it('should create category with unique slug', async () => {
      const dto = { name: 'Historical Sites', icon: '🏛️', display_order: 1, is_active: true };

      categoryRepository.findOne.mockResolvedValueOnce(null); // No duplicate
      categoryRepository.create.mockReturnValueOnce(dto);
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, slug: 'historical-sites' });

      const result = await service.createPlaceCategory(dto as any);

      expect(result.category.id).toBe('cat-1');
      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should handle Turkish characters in slug', async () => {
      const dto = { name: 'Güzel Yerler Çağlayanlar', icon: '💧', display_order: 0, is_active: true };

      categoryRepository.findOne.mockResolvedValueOnce(null);
      categoryRepository.create.mockReturnValueOnce(dto);
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, slug: 'guzel-yerler-caylayanlar' });

      const result = await service.createPlaceCategory(dto as any);

      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should append counter when slug already exists', async () => {
      const dto = { name: 'Park', icon: '🌳', display_order: 1, is_active: true };

      categoryRepository.findOne
        .mockResolvedValueOnce({ id: 'cat-1', slug: 'park' }) // park exists
        .mockResolvedValueOnce({ id: 'cat-2', slug: 'park-1' }) // park-1 exists
        .mockResolvedValueOnce(null); // park-2 is unique

      categoryRepository.create.mockReturnValueOnce(dto);
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-3', ...dto, slug: 'park-2' });

      const result = await service.createPlaceCategory(dto as any);

      expect(result.category.slug).toBe('park-2');
    });

    it('should set default display_order to 0 when not provided', async () => {
      const dto = { name: 'Test' };

      categoryRepository.findOne.mockResolvedValueOnce(null);
      categoryRepository.create.mockReturnValueOnce({ ...dto, display_order: 0 });
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, display_order: 0, slug: 'test' });

      await service.createPlaceCategory(dto as any);

      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should set default is_active to true when not provided', async () => {
      const dto = { name: 'Test' };

      categoryRepository.findOne.mockResolvedValueOnce(null);
      categoryRepository.create.mockReturnValueOnce({ ...dto, is_active: true });
      categoryRepository.save.mockResolvedValueOnce({ id: 'cat-1', ...dto, is_active: true, slug: 'test' });

      await service.createPlaceCategory(dto as any);

      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // updatePlaceCategory Tests
  // ============================================================================
  describe('updatePlaceCategory', () => {
    it('should update category with partial fields', async () => {
      const category = { id: 'cat-1', name: 'Old Name', icon: null, display_order: 1, is_active: true };
      const dto = { name: 'New Name', icon: '✨' };

      categoryRepository.findOne.mockResolvedValueOnce(category);
      categoryRepository.save.mockResolvedValueOnce({ ...category, ...dto });

      await service.updatePlaceCategory('cat-1', dto);

      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when category not found', async () => {
      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updatePlaceCategory('invalid', {})).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });
  });

  // ============================================================================
  // deletePlaceCategory Tests
  // ============================================================================
  describe('deletePlaceCategory', () => {
    it('should delete category without places', async () => {
      const category = { id: 'cat-1', places: [] };

      categoryRepository.findOne.mockResolvedValueOnce(category);

      await service.deletePlaceCategory('cat-1');

      expect(categoryRepository.delete).toHaveBeenCalledWith('cat-1');
    });

    it('should throw BadRequestException when category has places', async () => {
      const category = { id: 'cat-1', places: [{ id: 'place-1' }] };

      categoryRepository.findOne.mockResolvedValueOnce(category);

      await expect(service.deletePlaceCategory('cat-1')).rejects.toThrow(
        new BadRequestException('Mekan bulunan kategori silinemez. Önce mekanları silin veya taşıyın.'),
      );
    });

    it('should throw NotFoundException when category not found', async () => {
      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.deletePlaceCategory('invalid')).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });
  });

  // ============================================================================
  // getAdminPlaces Tests
  // ============================================================================
  describe('getAdminPlaces', () => {
    it('should return places with pagination', async () => {
      const mockPlaces = [
        { id: 'place-1', name: 'Place 1', category: null, cover_image: null, images: [], is_active: true, is_free: true, created_at: new Date(), updated_at: new Date(), category_id: null, description: null, address: null, latitude: 0, longitude: 0, entrance_fee: null, opening_hours: null, best_season: null, how_to_get_there: null, distance_from_center: null, cover_image_id: null },
      ];

      placeRepository.getManyAndCount.mockResolvedValueOnce([mockPlaces, 10]);

      const result = await service.getAdminPlaces({ page: 1, limit: 20 });

      expect(result.places).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.total).toBe(10);
      expect(placeRepository.orderBy).toHaveBeenCalledWith('p.name', 'ASC');
    });

    it('should apply search filter', async () => {
      placeRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminPlaces({ search: 'Cappadocia', page: 1, limit: 20 });

      expect(placeRepository.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({ search: '%Cappadocia%' }),
      );
    });

    it('should apply category_id filter', async () => {
      placeRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminPlaces({ category_id: 'cat-1', page: 1, limit: 20 });

      expect(placeRepository.andWhere).toHaveBeenCalledWith('p.category_id = :category_id', { category_id: 'cat-1' });
    });

    it('should apply is_active filter', async () => {
      placeRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminPlaces({ is_active: true, page: 1, limit: 20 });

      expect(placeRepository.andWhere).toHaveBeenCalledWith('p.is_active = :is_active', { is_active: true });
    });

    it('should apply is_free filter', async () => {
      placeRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminPlaces({ is_free: false, page: 1, limit: 20 });

      expect(placeRepository.andWhere).toHaveBeenCalledWith('p.is_free = :is_free', { is_free: false });
    });

    it('should apply multiple filters together', async () => {
      placeRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getAdminPlaces({
        search: 'Beach',
        category_id: 'cat-1',
        is_active: true,
        is_free: true,
        page: 2,
        limit: 50,
      });

      expect(placeRepository.andWhere).toHaveBeenCalledTimes(4);
      expect(placeRepository.skip).toHaveBeenCalledWith(50); // (2-1)*50
      expect(placeRepository.take).toHaveBeenCalledWith(50);
    });
  });

  // ============================================================================
  // getAdminPlace Tests
  // ============================================================================
  describe('getAdminPlace', () => {
    it('should return place detail with all relations', async () => {
      const mockPlace = {
        id: 'place-1',
        name: 'Pamukkale',
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Nature', icon: '🌲' },
        cover_image: { url: 'https://cdn.example.com/cover.jpg' },
        images: [{ id: 'img-1', file_id: 'file-1', file: { url: 'https://cdn.example.com/img1.jpg' }, display_order: 1 }],
        address: 'Denizli',
        latitude: 37.9,
        longitude: 29.1,
        is_active: true,
        is_free: false,
        entrance_fee: 50,
        description: 'White terraces',
        opening_hours: '08:00-17:00',
        best_season: 'Spring',
        how_to_get_there: 'By car',
        distance_from_center: '20 km',
        cover_image_id: 'file-cover',
        created_at: new Date(),
        updated_at: new Date(),
      };

      placeRepository.findOne.mockResolvedValueOnce(mockPlace);

      const result = await service.getAdminPlace('place-1');

      expect(result.place.id).toBe('place-1');
      expect(result.place.name).toBe('Pamukkale');
      expect(result.place.category).not.toBeNull();
      expect(placeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'place-1' },
        relations: ['category', 'cover_image', 'images', 'images.file'],
      });
    });

    it('should throw NotFoundException when place not found', async () => {
      placeRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.getAdminPlace('invalid')).rejects.toThrow(
        new NotFoundException('Mekan bulunamadı'),
      );
    });
  });

  // ============================================================================
  // createPlace Tests
  // ============================================================================
  describe('createPlace', () => {
    it('should create place with all optional fields', async () => {
      const dto = {
        category_id: 'cat-1',
        name: 'Troy',
        description: 'Ancient Troy',
        address: 'Çanakkale',
        latitude: 39.9,
        longitude: 26.2,
        entrance_fee: 100,
        is_free: false,
        opening_hours: '08:00-19:00',
        best_season: 'Summer',
        how_to_get_there: 'By bus',
        distance_from_center: '30 km',
        cover_image_id: 'file-1',
        is_active: true,
      };

      categoryRepository.findOne.mockResolvedValueOnce({ id: 'cat-1', name: 'Historical' });
      placeRepository.create.mockReturnValueOnce(dto);
      placeRepository.save.mockResolvedValueOnce({ id: 'place-1', ...dto });
      placeRepository.findOne.mockResolvedValueOnce({
        id: 'place-1',
        ...dto,
        category: { id: 'cat-1', name: 'Historical', icon: null },
        cover_image: null,
        images: [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.createPlace(dto as any, 'user-1');

      expect(result.place.id).toBe('place-1');
      expect(result.place.name).toBe('Troy');
    });

    it('should throw BadRequestException when category not found', async () => {
      const dto = { category_id: 'invalid', name: 'Test' };

      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.createPlace(dto as any, 'user-1')).rejects.toThrow(
        new BadRequestException('Geçersiz kategori'),
      );
    });

    it('should allow place without category', async () => {
      const dto = { name: 'Test Place' };

      placeRepository.create.mockReturnValueOnce(dto);
      placeRepository.save.mockResolvedValueOnce({ id: 'place-1', ...dto });
      placeRepository.findOne.mockResolvedValueOnce({
        id: 'place-1',
        ...dto,
        category_id: null,
        category: null,
        cover_image: null,
        images: [],
        is_free: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.createPlace(dto as any, 'user-1');

      expect(result.place.category).toBeNull();
    });
  });

  // ============================================================================
  // updatePlace Tests
  // ============================================================================
  describe('updatePlace', () => {
    it('should update place with partial fields', async () => {
      const place = { id: 'place-1', name: 'Old Name', category_id: 'cat-1' };
      const dto = { name: 'New Name', is_free: false };

      placeRepository.findOne
        .mockResolvedValueOnce(place)
        .mockResolvedValueOnce({
          id: 'place-1',
          name: 'New Name',
          category_id: 'cat-1',
          category: { id: 'cat-1', name: 'Category', icon: null },
          is_free: false,
          cover_image: null,
          images: [],
          address: null,
          latitude: 0,
          longitude: 0,
          entrance_fee: null,
          opening_hours: null,
          best_season: null,
          how_to_get_there: null,
          distance_from_center: null,
          cover_image_id: null,
          description: null,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });

      await service.updatePlace('place-1', dto);

      expect(placeRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when place not found', async () => {
      placeRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updatePlace('invalid', {})).rejects.toThrow(
        new NotFoundException('Mekan bulunamadı'),
      );
    });

    it('should validate category_id when provided', async () => {
      const place = { id: 'place-1', category_id: 'cat-1' };

      placeRepository.findOne.mockResolvedValueOnce(place);
      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updatePlace('place-1', { category_id: 'invalid' })).rejects.toThrow(
        new BadRequestException('Geçersiz kategori'),
      );
    });

    it('should allow unsetting category_id with null', async () => {
      const place = { id: 'place-1', category_id: 'cat-1' };

      placeRepository.findOne
        .mockResolvedValueOnce(place)
        .mockResolvedValueOnce({
          id: 'place-1',
          category_id: null,
          category: null,
          name: 'Test',
          cover_image: null,
          images: [],
          address: null,
          latitude: 0,
          longitude: 0,
          entrance_fee: null,
          is_free: true,
          opening_hours: null,
          best_season: null,
          how_to_get_there: null,
          distance_from_center: null,
          cover_image_id: null,
          description: null,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });

      await service.updatePlace('place-1', { category_id: null });

      expect(placeRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // deletePlace Tests
  // ============================================================================
  describe('deletePlace', () => {
    it('should delete place', async () => {
      const place = { id: 'place-1', name: 'Test' };

      placeRepository.findOne.mockResolvedValueOnce(place);

      await service.deletePlace('place-1');

      expect(placeRepository.delete).toHaveBeenCalledWith('place-1');
    });

    it('should throw NotFoundException when place not found', async () => {
      placeRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.deletePlace('invalid')).rejects.toThrow(
        new NotFoundException('Mekan bulunamadı'),
      );
    });
  });

  // ============================================================================
  // addPlaceImages Tests
  // ============================================================================
  describe('addPlaceImages', () => {
    it('should add images with auto-ordering', async () => {
      const place = {
        id: 'place-1',
        images: [
          { id: 'img-1', display_order: 0 },
          { id: 'img-2', display_order: 1 },
        ],
      };
      const dto = { file_ids: ['file-3', 'file-4'] };

      placeRepository.findOne.mockResolvedValueOnce(place).mockResolvedValueOnce({
        id: 'place-1',
        images: [
          { id: 'img-1', display_order: 0, file_id: 'file-1', file: null },
          { id: 'img-2', display_order: 1, file_id: 'file-2', file: null },
          { id: 'img-3', display_order: 2, file_id: 'file-3', file: null },
          { id: 'img-4', display_order: 3, file_id: 'file-4', file: null },
        ],
        category: null,
        cover_image: null,
        name: 'Test',
        address: null,
        latitude: 0,
        longitude: 0,
        is_active: true,
        is_free: true,
        category_id: null,
        description: null,
        entrance_fee: null,
        opening_hours: null,
        best_season: null,
        how_to_get_there: null,
        distance_from_center: null,
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      imageRepository.create.mockImplementation((data) => data);

      await service.addPlaceImages('place-1', dto as any);

      expect(imageRepository.save).toHaveBeenCalled();
    });

    it('should handle empty place.images', async () => {
      const place = { id: 'place-1', images: null };
      const dto = { file_ids: ['file-1'] };

      placeRepository.findOne.mockResolvedValueOnce(place).mockResolvedValueOnce({
        id: 'place-1',
        images: [{ id: 'img-1', display_order: 0, file_id: 'file-1', file: null }],
        category: null,
        cover_image: null,
        name: 'Test',
        address: null,
        latitude: 0,
        longitude: 0,
        is_active: true,
        is_free: true,
        category_id: null,
        description: null,
        entrance_fee: null,
        opening_hours: null,
        best_season: null,
        how_to_get_there: null,
        distance_from_center: null,
        cover_image_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      imageRepository.create.mockImplementation((data) => data);

      await service.addPlaceImages('place-1', dto as any);

      expect(imageRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when place not found', async () => {
      placeRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.addPlaceImages('invalid', { file_ids: ['file-1'] } as any)).rejects.toThrow(
        new NotFoundException('Mekan bulunamadı'),
      );
    });
  });

  // ============================================================================
  // deletePlaceImage Tests
  // ============================================================================
  describe('deletePlaceImage', () => {
    it('should delete image without affecting cover_image', async () => {
      const image = { id: 'img-1', file_id: 'file-1', place_id: 'place-1', place: { cover_image_id: 'file-2' } };

      imageRepository.findOne.mockResolvedValueOnce(image);

      await service.deletePlaceImage('img-1');

      expect(imageRepository.delete).toHaveBeenCalledWith('img-1');
      expect(placeRepository.update).not.toHaveBeenCalled();
    });

    it('should clear cover_image when deleting image used as cover', async () => {
      const image = { id: 'img-1', file_id: 'file-1', place_id: 'place-1', place: { cover_image_id: 'file-1' } };

      imageRepository.findOne.mockResolvedValueOnce(image);

      await service.deletePlaceImage('img-1');

      expect(placeRepository.update).toHaveBeenCalledWith('place-1', { cover_image_id: null });
      expect(imageRepository.delete).toHaveBeenCalledWith('img-1');
    });

    it('should throw NotFoundException when image not found', async () => {
      imageRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.deletePlaceImage('invalid')).rejects.toThrow(
        new NotFoundException('Fotoğraf bulunamadı'),
      );
    });
  });

  // ============================================================================
  // reorderPlaceImages Tests
  // ============================================================================
  describe('reorderPlaceImages', () => {
    it('should reorder images', async () => {
      const place = { id: 'place-1', name: 'Test' };
      const dto = { ordered_ids: ['img-2', 'img-1', 'img-3'] };

      placeRepository.findOne
        .mockResolvedValueOnce(place)
        .mockResolvedValueOnce({
          id: 'place-1',
          images: [
            { id: 'img-1', display_order: 1, file_id: 'file-1', file: null },
            { id: 'img-2', display_order: 0, file_id: 'file-2', file: null },
            { id: 'img-3', display_order: 2, file_id: 'file-3', file: null },
          ],
          category: null,
          cover_image: null,
          name: 'Test',
          address: null,
          latitude: 0,
          longitude: 0,
          is_active: true,
          is_free: true,
          category_id: null,
          description: null,
          entrance_fee: null,
          opening_hours: null,
          best_season: null,
          how_to_get_there: null,
          distance_from_center: null,
          cover_image_id: null,
          created_at: new Date(),
          updated_at: new Date(),
        });

      await service.reorderPlaceImages('place-1', dto as any);

      expect(imageRepository.update).toHaveBeenCalledWith('img-2', { display_order: 0 });
      expect(imageRepository.update).toHaveBeenCalledWith('img-1', { display_order: 1 });
      expect(imageRepository.update).toHaveBeenCalledWith('img-3', { display_order: 2 });
    });

    it('should throw NotFoundException when place not found', async () => {
      placeRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.reorderPlaceImages('invalid', { ordered_ids: ['img-1'] } as any),
      ).rejects.toThrow(new NotFoundException('Mekan bulunamadı'));
    });
  });

  // ============================================================================
  // Private Helper Methods Tests
  // ============================================================================
  describe('Private Helpers', () => {
    it('should map place with all fields and relations', () => {
      const place = {
        id: 'place-1',
        name: 'Cappadocia',
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Nature', icon: '🌲' },
        description: 'Fairy chimneys',
        address: 'Nevsehir',
        latitude: 38.7,
        longitude: 34.6,
        entrance_fee: 25,
        is_free: false,
        opening_hours: '08:00-18:00',
        best_season: 'Spring/Fall',
        how_to_get_there: 'By car',
        distance_from_center: '15 km',
        cover_image_id: 'file-cover',
        cover_image: { url: 'https://cdn.example.com/cover.jpg' },
        is_active: true,
        images: [
          { id: 'img-1', file_id: 'file-1', file: { url: 'https://cdn.example.com/img1.jpg' }, display_order: 1 },
          { id: 'img-2', file_id: 'file-2', file: null, display_order: 2 },
        ],
        created_at: new Date('2026-01-01'),
        updated_at: new Date('2026-02-01'),
      };

      const mapped = service['mapPlace'](place);

      expect(mapped.id).toBe('place-1');
      expect(mapped.name).toBe('Cappadocia');
      expect(mapped.category).not.toBeNull();
      expect(mapped.category.id).toBe('cat-1');
      expect(mapped.images).toHaveLength(2);
      expect(mapped.images[1].url).toBeNull();
    });

    it('should map place with null fields', () => {
      const place = {
        id: 'place-1',
        name: 'Simple Place',
        category_id: null,
        category: null,
        description: null,
        address: null,
        latitude: 0,
        longitude: 0,
        entrance_fee: null,
        is_free: true,
        opening_hours: null,
        best_season: null,
        how_to_get_there: null,
        distance_from_center: null,
        cover_image_id: null,
        cover_image: null,
        is_active: true,
        images: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mapped = service['mapPlace'](place);

      expect(mapped.category).toBeNull();
      expect(mapped.description).toBeNull();
      expect(mapped.cover_image_url).toBeNull();
      expect(mapped.images).toEqual([]);
    });

    it('should generate slug with Turkish character conversion', () => {
      const slug = service['generatePlaceSlug']('Üzüm Bahçesi Ördek Gölü');

      expect(slug).toContain('uzum');
      expect(slug).toContain('bahcesi');
      expect(slug).toContain('ordek');
      expect(slug).toContain('golu');
    });

    it('should clean special characters and multiple hyphens', () => {
      const slug = service['generatePlaceSlug']('Test!@#$%^&*()Place---Name');

      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toContain('--');
    });

    it('should handle spacing in slug generation', () => {
      const slug = service['generatePlaceSlug']('Multiple   Spaces   Here');

      expect(slug).toBe('multiple-spaces-here');
    });
  });
});
