import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuideAdminService } from './guide-admin.service';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GuideAdminService', () => {
  let service: GuideAdminService;
  let categoryRepository: any;
  let itemRepository: any;

  beforeEach(async () => {
    categoryRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    itemRepository = {
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
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuideAdminService,
        { provide: getRepositoryToken(GuideCategory), useValue: categoryRepository },
        { provide: getRepositoryToken(GuideItem), useValue: itemRepository },
      ],
    }).compile();

    service = module.get<GuideAdminService>(GuideAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================================================
  // getGuideCategories Tests
  // ============================================================================
  describe('getGuideCategories', () => {
    it('should return root categories with hierarchy', async () => {
      const mockCategories = [
        {
          id: 'cat-1',
          name: 'Root',
          slug: 'root',
          parent_id: null,
          parent: null,
          children: [
            { id: 'cat-2', name: 'Child', slug: 'child', icon: '📌', color: '#fff', display_order: 1, is_active: true, created_at: new Date() },
          ],
          icon: '🏠',
          color: '#000',
          display_order: 1,
          is_active: true,
          created_at: new Date(),
        },
      ];

      categoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.getGuideCategories();

      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].id).toBe('cat-1');
      expect(result.categories[0].children).toHaveLength(1);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        relations: ['parent', 'children'],
        order: { display_order: 'ASC', name: 'ASC' },
      });
    });

    it('should filter only root categories', async () => {
      const mockCategories = [
        { id: 'cat-1', name: 'Root 1', slug: 'root1', parent_id: null, parent: null, children: [] },
        { id: 'cat-2', name: 'Child', slug: 'child', parent_id: 'cat-1', parent: { id: 'cat-1' } },
        { id: 'cat-3', name: 'Root 2', slug: 'root2', parent_id: null, parent: null, children: [] },
      ];

      categoryRepository.find.mockResolvedValue(mockCategories);

      const result = await service.getGuideCategories();

      expect(result.categories).toHaveLength(2);
      expect(result.categories[0].id).toBe('cat-1');
      expect(result.categories[1].id).toBe('cat-3');
    });
  });

  // ============================================================================
  // createGuideCategory Tests
  // ============================================================================
  describe('createGuideCategory', () => {
    it('should create root category with unique slug', async () => {
      const dto = { name: 'Root Category', icon: '🏠', color: '#000', display_order: 1, is_active: true };

      categoryRepository.findOne.mockResolvedValue(null); // No duplicate slug
      categoryRepository.create.mockReturnValue(dto);
      categoryRepository.save.mockResolvedValue({ id: 'cat-1', ...dto, slug: 'root-category' });
      categoryRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 'cat-1',
        name: 'Root Category',
        slug: 'root-category',
        parent_id: null,
        parent: null,
        children: [],
        icon: '🏠',
        color: '#000',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
      });

      const result = await service.createGuideCategory(dto);

      expect(result.category.id).toBe('cat-1');
      expect(result.category.parent_id).toBeNull();
      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should create subcategory with parent_id', async () => {
      const parentCategory = { id: 'parent-1', parent_id: null, name: 'Parent' };
      const dto = { name: 'Sub Category', parent_id: 'parent-1' };

      categoryRepository.findOne
        .mockResolvedValueOnce(parentCategory) // Find parent
        .mockResolvedValueOnce(null) // Check slug uniqueness
        .mockResolvedValueOnce({
          id: 'cat-2',
          name: 'Sub Category',
          slug: 'sub-category',
          parent_id: 'parent-1',
          parent: parentCategory,
          children: [],
          display_order: 0,
          is_active: true,
          created_at: new Date(),
        });

      categoryRepository.create.mockReturnValue(dto);
      categoryRepository.save.mockResolvedValue({ id: 'cat-2', ...dto, slug: 'sub-category' });

      const result = await service.createGuideCategory(dto as any);

      expect(result.category.parent_id).toBe('parent-1');
    });

    it('should throw BadRequestException when parent not found', async () => {
      const dto = { name: 'Test', parent_id: 'invalid-parent' };

      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.createGuideCategory(dto as any)).rejects.toThrow(
        new BadRequestException('Üst kategori bulunamadı'),
      );
    });

    it('should throw BadRequestException when parent has parent (max 2 levels)', async () => {
      const grandparentCategory = { id: 'gp-1', parent_id: 'gp-2', name: 'Grandparent' };
      const dto = { name: 'Test', parent_id: 'gp-1' };

      categoryRepository.findOne.mockResolvedValueOnce(grandparentCategory);

      await expect(service.createGuideCategory(dto as any)).rejects.toThrow(
        new BadRequestException('Maksimum 2 seviye hiyerarşi desteklenir'),
      );
    });
  });

  // ============================================================================
  // updateGuideCategory Tests
  // ============================================================================
  describe('updateGuideCategory', () => {
    it('should update category with partial fields', async () => {
      const category = { id: 'cat-1', name: 'Old Name', parent_id: null, icon: null, color: null, display_order: 1, is_active: true };
      const dto = { name: 'New Name', icon: '🆕' };

      categoryRepository.findOne
        .mockResolvedValueOnce(category) // Find to check existence
        .mockResolvedValueOnce({
          id: 'cat-1',
          name: 'New Name',
          parent_id: null,
          icon: '🆕',
          color: null,
          display_order: 1,
          is_active: true,
          parent: null,
          children: [],
          created_at: new Date(),
        });

      await service.updateGuideCategory('cat-1', dto);

      expect(categoryRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when category not found', async () => {
      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updateGuideCategory('invalid', {})).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });

    it('should throw BadRequestException when category is set as its own parent', async () => {
      const category = { id: 'cat-1', name: 'Self', parent_id: null };

      categoryRepository.findOne.mockResolvedValueOnce(category);

      await expect(service.updateGuideCategory('cat-1', { parent_id: 'cat-1' })).rejects.toThrow(
        new BadRequestException('Kategori kendisinin üst kategorisi olamaz'),
      );
    });

    it('should throw BadRequestException when new parent not found', async () => {
      const category = { id: 'cat-1', name: 'Test', parent_id: null };

      categoryRepository.findOne.mockResolvedValueOnce(category).mockResolvedValueOnce(null);

      await expect(service.updateGuideCategory('cat-1', { parent_id: 'invalid-parent' })).rejects.toThrow(
        new BadRequestException('Üst kategori bulunamadı'),
      );
    });

    it('should throw BadRequestException when new parent has parent (max 2 levels)', async () => {
      const category = { id: 'cat-1', name: 'Test', parent_id: null };
      const grandparent = { id: 'gp-1', parent_id: 'gp-2', name: 'Grandparent' };

      categoryRepository.findOne.mockResolvedValueOnce(category).mockResolvedValueOnce(grandparent);

      await expect(service.updateGuideCategory('cat-1', { parent_id: 'gp-1' })).rejects.toThrow(
        new BadRequestException('Maksimum 2 seviye hiyerarşi desteklenir'),
      );
    });

    it('should allow unsetting parent_id', async () => {
      const category = { id: 'cat-1', name: 'Test', parent_id: 'parent-1' };

      categoryRepository.findOne.mockResolvedValueOnce(category).mockResolvedValueOnce({
        id: 'cat-1',
        name: 'Test',
        parent_id: null,
        icon: null,
        color: null,
        display_order: 0,
        is_active: true,
        parent: null,
        children: [],
        created_at: new Date(),
      });

      await service.updateGuideCategory('cat-1', { parent_id: null });

      expect(categoryRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // deleteGuideCategory Tests
  // ============================================================================
  describe('deleteGuideCategory', () => {
    it('should delete category without children or items', async () => {
      const category = { id: 'cat-1', name: 'Empty', children: [], items: [] };

      categoryRepository.findOne.mockResolvedValueOnce(category);

      await service.deleteGuideCategory('cat-1');

      expect(categoryRepository.delete).toHaveBeenCalledWith('cat-1');
    });

    it('should throw BadRequestException when category has children', async () => {
      const category = { id: 'cat-1', children: [{ id: 'child-1' }], items: [] };

      categoryRepository.findOne.mockResolvedValueOnce(category);

      await expect(service.deleteGuideCategory('cat-1')).rejects.toThrow(
        new BadRequestException('Alt kategorileri olan bir kategori silinemez. Önce alt kategorileri silin.'),
      );
    });

    it('should throw BadRequestException when category has items', async () => {
      const category = { id: 'cat-1', children: [], items: [{ id: 'item-1' }] };

      categoryRepository.findOne.mockResolvedValueOnce(category);

      await expect(service.deleteGuideCategory('cat-1')).rejects.toThrow(
        new BadRequestException('İçerik bulunan kategori silinemez. Önce içerikleri silin veya taşıyın.'),
      );
    });

    it('should throw NotFoundException when category not found', async () => {
      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.deleteGuideCategory('invalid')).rejects.toThrow(
        new NotFoundException('Kategori bulunamadı'),
      );
    });
  });

  // ============================================================================
  // getGuideItems Tests
  // ============================================================================
  describe('getGuideItems', () => {
    it('should return items with pagination', async () => {
      const mockItems = [
        { id: 'item-1', name: 'Item 1', category_id: 'cat-1', category: { id: 'cat-1', name: 'Category', parent: null }, is_active: true, created_at: new Date(), updated_at: new Date(), phone: '555-1234', address: 'Test', email: null, website_url: null, working_hours: null, latitude: null, longitude: null, logo_file_id: null, description: null },
      ];

      itemRepository.getManyAndCount.mockResolvedValueOnce([mockItems, 10]);

      const result = await service.getGuideItems({ page: 1, limit: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.total).toBe(10);
      expect(itemRepository.orderBy).toHaveBeenCalledWith('gi.name', 'ASC');
    });

    it('should apply search filter', async () => {
      itemRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getGuideItems({ search: 'test', page: 1, limit: 20 });

      expect(itemRepository.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.objectContaining({ search: '%test%' }),
      );
    });

    it('should apply category_id filter', async () => {
      itemRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getGuideItems({ category_id: 'cat-1', page: 1, limit: 20 });

      expect(itemRepository.andWhere).toHaveBeenCalledWith('gi.category_id = :category_id', { category_id: 'cat-1' });
    });

    it('should apply is_active filter', async () => {
      itemRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getGuideItems({ is_active: true, page: 1, limit: 20 });

      expect(itemRepository.andWhere).toHaveBeenCalledWith('gi.is_active = :is_active', { is_active: true });
    });

    it('should skip is_active filter when undefined', async () => {
      itemRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getGuideItems({ page: 1, limit: 20 });

      // Verify andWhere was not called with is_active
      const calls = itemRepository.andWhere.mock.calls;
      const hasIsActiveFilter = calls.some((call) => call[0]?.includes('is_active'));
      expect(hasIsActiveFilter).toBe(false);
    });

    it('should apply multiple filters together', async () => {
      itemRepository.getManyAndCount.mockResolvedValueOnce([[], 0]);

      await service.getGuideItems({ search: 'test', category_id: 'cat-1', is_active: false, page: 2, limit: 50 });

      expect(itemRepository.andWhere).toHaveBeenCalledTimes(3);
      expect(itemRepository.skip).toHaveBeenCalledWith(50); // (2-1)*50
      expect(itemRepository.take).toHaveBeenCalledWith(50);
    });
  });

  // ============================================================================
  // createGuideItem Tests
  // ============================================================================
  describe('createGuideItem', () => {
    it('should create guide item with all optional fields', async () => {
      const category = { id: 'cat-1', name: 'Category' };
      const dto = {
        category_id: 'cat-1',
        name: 'Test Item',
        phone: '555-1234',
        address: 'Test Address',
        email: 'test@example.com',
        website_url: 'https://example.com',
        working_hours: '9AM-5PM',
        latitude: 40.7,
        longitude: 29.9,
        logo_file_id: 'file-1',
        description: 'Test description',
        is_active: true,
      };

      categoryRepository.findOne.mockResolvedValueOnce(category);
      itemRepository.create.mockReturnValueOnce(dto);
      itemRepository.save.mockResolvedValueOnce({ id: 'item-1', ...dto });
      itemRepository.findOne.mockResolvedValueOnce({
        id: 'item-1',
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
        category: category,
      });

      const result = await service.createGuideItem(dto);

      expect(result.item.id).toBe('item-1');
      expect(result.item.name).toBe('Test Item');
      expect(result.item.email).toBe('test@example.com');
    });

    it('should create item with minimal fields', async () => {
      const category = { id: 'cat-1', name: 'Category' };
      const dto = { category_id: 'cat-1', name: 'Minimal' };

      categoryRepository.findOne.mockResolvedValueOnce(category);
      itemRepository.create.mockReturnValueOnce(dto);
      itemRepository.save.mockResolvedValueOnce({ id: 'item-1', ...dto });
      itemRepository.findOne.mockResolvedValueOnce({
        id: 'item-1',
        ...dto,
        phone: '',
        address: null,
        email: null,
        website_url: null,
        working_hours: null,
        latitude: null,
        longitude: null,
        logo_file_id: null,
        description: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        category,
      });

      const result = await service.createGuideItem(dto as any);

      expect(result.item.id).toBe('item-1');
      expect(result.item.website_url).toBeNull();
    });

    it('should throw BadRequestException when category not found', async () => {
      const dto = { category_id: 'invalid', name: 'Test' };

      categoryRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.createGuideItem(dto as any)).rejects.toThrow(
        new BadRequestException('Kategori bulunamadı'),
      );
    });
  });

  // ============================================================================
  // updateGuideItem Tests
  // ============================================================================
  describe('updateGuideItem', () => {
    it('should update item with partial fields', async () => {
      const item = { id: 'item-1', name: 'Old Name', phone: '111-1111', is_active: true };
      const dto = { name: 'New Name', phone: '222-2222' };

      itemRepository.findOne.mockResolvedValueOnce(item).mockResolvedValueOnce({
        id: 'item-1',
        name: 'New Name',
        phone: '222-2222',
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Category', parent: null },
        address: null,
        email: null,
        website_url: null,
        working_hours: null,
        latitude: null,
        longitude: null,
        logo_file_id: null,
        description: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await service.updateGuideItem('item-1', dto);

      expect(itemRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when item not found', async () => {
      itemRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.updateGuideItem('invalid', {})).rejects.toThrow(
        new NotFoundException('İçerik bulunamadı'),
      );
    });

    it('should validate category when category_id is changed', async () => {
      const item = { id: 'item-1', category_id: 'cat-1', name: 'Test' };

      itemRepository.findOne.mockResolvedValueOnce(item).mockResolvedValueOnce(null);

      await expect(service.updateGuideItem('item-1', { category_id: 'invalid' })).rejects.toThrow(
        new BadRequestException('Kategori bulunamadı'),
      );
    });

    it('should accept valid category_id change', async () => {
      const item = { id: 'item-1', category_id: 'cat-1', name: 'Test' };
      const newCategory = { id: 'cat-2', name: 'New Category' };

      itemRepository.findOne = jest
        .fn()
        .mockResolvedValueOnce(item) // First findOne: Check item exists
        .mockResolvedValueOnce(newCategory) // Second findOne: Check new category exists (in guideCategoryRepository)
        .mockResolvedValueOnce({
          // Third findOne: Get updated item with relations
          id: 'item-1',
          category_id: 'cat-2',
          name: 'Test',
          category: newCategory,
          phone: '',
          address: null,
          email: null,
          website_url: null,
          working_hours: null,
          latitude: null,
          longitude: null,
          logo_file_id: null,
          description: null,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        });

      // Set up categoryRepository.findOne separately
      categoryRepository.findOne = jest.fn().mockResolvedValueOnce(newCategory);

      await service.updateGuideItem('item-1', { category_id: 'cat-2' });

      expect(itemRepository.save).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // deleteGuideItem Tests
  // ============================================================================
  describe('deleteGuideItem', () => {
    it('should delete guide item', async () => {
      const item = { id: 'item-1', name: 'Test' };

      itemRepository.findOne.mockResolvedValueOnce(item);

      await service.deleteGuideItem('item-1');

      expect(itemRepository.delete).toHaveBeenCalledWith('item-1');
    });

    it('should throw NotFoundException when item not found', async () => {
      itemRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.deleteGuideItem('invalid')).rejects.toThrow(
        new NotFoundException('İçerik bulunamadı'),
      );
    });
  });

  // ============================================================================
  // Private Helper Methods Tests
  // ============================================================================
  describe('Private Helpers', () => {
    it('should map guide category with parent and children', () => {
      const category = {
        id: 'cat-1',
        name: 'Test',
        slug: 'test',
        parent_id: 'parent-1',
        parent: { id: 'parent-1', name: 'Parent' },
        children: [{ id: 'child-1', name: 'Child', slug: 'child', icon: '📌', color: '#fff', display_order: 1, is_active: true, created_at: new Date() }],
        icon: '🏠',
        color: '#000',
        display_order: 1,
        is_active: true,
        created_at: new Date(),
      };

      const mapped = service['mapGuideCategory'](category);

      expect(mapped.id).toBe('cat-1');
      expect(mapped.parent_id).toBe('parent-1');
      expect(mapped.parent).not.toBeNull();
      expect(mapped.children).toHaveLength(1);
    });

    it('should map guide category with null parent and empty children', () => {
      const category = {
        id: 'cat-1',
        name: 'Root',
        slug: 'root',
        parent_id: null,
        parent: null,
        children: [],
        icon: null,
        color: null,
        display_order: 0,
        is_active: true,
        created_at: new Date(),
      };

      const mapped = service['mapGuideCategory'](category);

      expect(mapped.parent).toBeNull();
      expect(mapped.icon).toBeNull();
      expect(mapped.color).toBeNull();
      expect(mapped.children).toEqual([]);
    });

    it('should map guide item with category and null fields', () => {
      const item = {
        id: 'item-1',
        name: 'Test',
        category_id: 'cat-1',
        category: { id: 'cat-1', name: 'Category', parent: null },
        phone: '555-1234',
        address: null,
        email: null,
        website_url: null,
        working_hours: null,
        latitude: null,
        longitude: null,
        logo_file_id: null,
        description: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mapped = service['mapGuideItem'](item);

      expect(mapped.id).toBe('item-1');
      expect(mapped.category.id).toBe('cat-1');
      expect(mapped.address).toBeNull();
      expect(mapped.website_url).toBeNull();
      expect(mapped.longitude).toBeNull();
    });

    it('should generate slug with Turkish character conversion', async () => {
      categoryRepository.findOne.mockResolvedValueOnce(null); // No duplicate

      const slug = await service['generateGuideSlug']('Özel İşin Yer Seç');

      // Turkish characters should be converted properly
      expect(slug).toBe('ozel-i-sin-yer-sec');
    });

    it('should generate unique slug with counter for duplicates', async () => {
      categoryRepository.findOne.mockResolvedValueOnce({ id: 'cat-1', slug: 'test' });
      categoryRepository.findOne.mockResolvedValueOnce({ id: 'cat-2', slug: 'test-1' });
      categoryRepository.findOne.mockResolvedValueOnce(null); // test-2 is unique

      const slug = await service['generateGuideSlug']('test');

      expect(slug).toBe('test-2');
    });

    it('should handle while loop for slug uniqueness check', async () => {
      categoryRepository.findOne
        .mockResolvedValueOnce({ slug: 'test' })
        .mockResolvedValueOnce({ slug: 'test-1' })
        .mockResolvedValueOnce({ slug: 'test-2' })
        .mockResolvedValueOnce({ slug: 'test-3' })
        .mockResolvedValueOnce(null); // test-4 is unique

      const slug = await service['generateGuideSlug']('test');

      expect(slug).toBe('test-4');
      expect(categoryRepository.findOne).toHaveBeenCalledTimes(5);
    });

    it('should clean special characters from slug', async () => {
      categoryRepository.findOne.mockResolvedValueOnce(null);

      const slug = await service['generateGuideSlug']('Test!@#$%^&*()_+={}|:";<>?,./');

      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug).not.toContain('-');
      expect(slug).toBe('test');
    });
  });
});
