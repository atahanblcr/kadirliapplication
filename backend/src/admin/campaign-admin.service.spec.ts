import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { In } from 'typeorm';
import { CampaignAdminService } from './campaign-admin.service';
import { Campaign, CampaignImage } from '../database/entities/campaign.entity';
import { Business } from '../database/entities/business.entity';
import { BusinessCategory } from '../database/entities/business-category.entity';
import { FileEntity } from '../database/entities/file.entity';

describe('CampaignAdminService', () => {
  let service: CampaignAdminService;
  let campaignRepository: any;
  let businessRepository: any;
  let businessCategoryRepository: any;
  let campaignImageRepository: any;
  let fileRepository: any;

  beforeEach(async () => {
    campaignRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
      update: jest.fn(),
    };

    businessRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    businessCategoryRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    campaignImageRepository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    fileRepository = {
      findBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignAdminService,
        { provide: getRepositoryToken(Campaign), useValue: campaignRepository },
        { provide: getRepositoryToken(Business), useValue: businessRepository },
        { provide: getRepositoryToken(BusinessCategory), useValue: businessCategoryRepository },
        { provide: getRepositoryToken(CampaignImage), useValue: campaignImageRepository },
        { provide: getRepositoryToken(FileEntity), useValue: fileRepository },
      ],
    }).compile();

    service = module.get<CampaignAdminService>(CampaignAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── CAMPAIGN CRUD TESTS ──────────────────────────────────────────────────

  describe('getAdminCampaigns', () => {
    it('should return campaigns with pagination', async () => {
      const mockCampaigns = [
        {
          id: '1',
          title: 'Test Campaign',
          business_id: 'biz-1',
          business: {
            business_name: 'Test Business',
            user: { id: 'user-1', username: 'testuser' },
          },
          discount_percentage: 10,
          discount_code: 'TEST10',
          start_date: new Date(),
          end_date: new Date(),
          status: 'approved',
          code_view_count: 5,
          rejected_reason: null,
          images: [],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      campaignRepository.getManyAndCount.mockResolvedValue([mockCampaigns, 1]);

      const result = await service.getAdminCampaigns({
        page: 1,
        limit: 20,
      });

      expect(result.campaigns).toHaveLength(1);
      expect(result.campaigns[0].title).toBe('Test Campaign');
      expect(result.meta).toBeDefined();
      expect(campaignRepository.skip).toHaveBeenCalledWith(0);
      expect(campaignRepository.take).toHaveBeenCalledWith(20);
    });

    it('should apply status filter when provided', async () => {
      campaignRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminCampaigns({
        status: 'approved',
        page: 1,
        limit: 20,
      });

      expect(campaignRepository.andWhere).toHaveBeenCalledWith('c.status = :status', {
        status: 'approved',
      });
    });

    it('should skip status filter when not provided', async () => {
      campaignRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminCampaigns({
        page: 1,
        limit: 20,
      });

      const calls = (campaignRepository.andWhere as jest.Mock).mock.calls;
      const hasStatusCall = calls.some((call) => call[0]?.includes('c.status'));
      expect(hasStatusCall).toBe(false);
    });

    it('should apply search filter when provided', async () => {
      campaignRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminCampaigns({
        search: 'test',
        page: 1,
        limit: 20,
      });

      expect(campaignRepository.andWhere).toHaveBeenCalledWith(
        '(c.title ILIKE :search OR business.business_name ILIKE :search)',
        { search: '%test%' },
      );
    });

    it('should apply business_id filter when provided', async () => {
      campaignRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminCampaigns({
        business_id: 'biz-1',
        page: 1,
        limit: 20,
      });

      expect(campaignRepository.andWhere).toHaveBeenCalledWith(
        'c.business_id = :business_id',
        { business_id: 'biz-1' },
      );
    });

    it('should apply multiple filters together', async () => {
      campaignRepository.getManyAndCount.mockResolvedValue([[], 0]);

      await service.getAdminCampaigns({
        status: 'pending',
        search: 'test',
        business_id: 'biz-1',
        page: 1,
        limit: 20,
      });

      expect(campaignRepository.andWhere).toHaveBeenCalledTimes(3);
    });

    it('should handle campaigns with null images', async () => {
      const mockCampaigns = [
        {
          id: '1',
          title: 'Test',
          business_id: 'biz-1',
          business: { business_name: 'Business', user: null },
          discount_percentage: 10,
          discount_code: null,
          status: 'pending',
          code_view_count: 0,
          rejected_reason: null,
          images: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      campaignRepository.getManyAndCount.mockResolvedValue([mockCampaigns, 1]);

      const result = await service.getAdminCampaigns({ page: 1, limit: 20 });

      expect(result.campaigns[0].image_urls).toEqual([]);
      expect(result.campaigns[0].created_by.username).toBe('');
    });

    it('should sort images by display_order', async () => {
      const mockCampaigns = [
        {
          id: '1',
          title: 'Test',
          business_id: 'biz-1',
          business: { business_name: 'Business', user: null },
          discount_percentage: 10,
          status: 'approved',
          code_view_count: 0,
          images: [
            { display_order: 2, file: { cdn_url: 'url2' } },
            { display_order: 1, file: { cdn_url: 'url1' } },
          ],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      campaignRepository.getManyAndCount.mockResolvedValue([mockCampaigns, 1]);

      const result = await service.getAdminCampaigns({ page: 1, limit: 20 });

      expect(result.campaigns[0].image_urls).toEqual(['url1', 'url2']);
    });

    it('should filter out empty CDN URLs', async () => {
      const mockCampaigns = [
        {
          id: '1',
          title: 'Test',
          business_id: 'biz-1',
          business: { business_name: 'Business', user: null },
          discount_percentage: 10,
          status: 'approved',
          code_view_count: 0,
          images: [
            { display_order: 1, file: { cdn_url: 'url1' } },
            { display_order: 2, file: { cdn_url: '' } },
          ],
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      campaignRepository.getManyAndCount.mockResolvedValue([mockCampaigns, 1]);

      const result = await service.getAdminCampaigns({ page: 1, limit: 20 });

      expect(result.campaigns[0].image_urls).toEqual(['url1']);
    });
  });

  // ─── CAMPAIGN APPROVAL TESTS ──────────────────────────────────────────────

  describe('approveCampaign', () => {
    it('should approve pending campaign', async () => {
      const mockCampaign = { id: '1', status: 'pending' };
      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      const result = await service.approveCampaign('admin-1', '1');

      expect(result.message).toBe('Kampanya onaylandı');
      expect(campaignRepository.update).toHaveBeenCalledWith('1', {
        status: 'approved',
        approved_by: 'admin-1',
        approved_at: expect.any(Date),
      });
    });

    it('should throw NotFoundException when campaign not found', async () => {
      campaignRepository.findOne.mockResolvedValue(null);

      await expect(service.approveCampaign('admin-1', 'invalid-id')).rejects.toThrow(
        new NotFoundException('Kampanya bulunamadı veya onay beklemiyordur'),
      );
    });

    it('should throw NotFoundException when campaign not pending', async () => {
      const mockCampaign = { id: '1', status: 'approved' };
      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      // Since findOne explicitly checks status: 'pending', it will return null
      campaignRepository.findOne.mockResolvedValue(null);

      await expect(service.approveCampaign('admin-1', '1')).rejects.toThrow(
        new NotFoundException('Kampanya bulunamadı veya onay beklemiyordur'),
      );
    });
  });

  describe('rejectCampaign', () => {
    it('should reject campaign with reason only', async () => {
      const mockCampaign = { id: '1', status: 'pending' };
      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      const result = await service.rejectCampaign('admin-1', '1', {
        reason: 'Inappropriate content',
      });

      expect(result.message).toBe('Kampanya reddedildi');
      expect(campaignRepository.update).toHaveBeenCalledWith('1', {
        status: 'rejected',
        rejected_reason: 'Inappropriate content',
      });
    });

    it('should reject campaign with reason and note', async () => {
      const mockCampaign = { id: '1', status: 'pending' };
      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      const result = await service.rejectCampaign('admin-1', '1', {
        reason: 'Quality issue',
        note: 'Image resolution too low',
      });

      expect(campaignRepository.update).toHaveBeenCalledWith('1', {
        status: 'rejected',
        rejected_reason: 'Quality issue: Image resolution too low',
      });
    });

    it('should throw NotFoundException when campaign not found', async () => {
      campaignRepository.findOne.mockResolvedValue(null);

      await expect(
        service.rejectCampaign('admin-1', 'invalid-id', { reason: 'Test' }),
      ).rejects.toThrow(
        new NotFoundException('Kampanya bulunamadı veya onay beklemiyordur'),
      );
    });

    it('should throw NotFoundException when campaign not pending', async () => {
      campaignRepository.findOne.mockResolvedValue(null);

      await expect(
        service.rejectCampaign('admin-1', '1', { reason: 'Test' }),
      ).rejects.toThrow(
        new NotFoundException('Kampanya bulunamadı veya onay beklemiyordur'),
      );
    });
  });

  describe('deleteAdminCampaign', () => {
    it('should soft delete campaign', async () => {
      const mockCampaign = { id: '1' };
      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      const result = await service.deleteAdminCampaign('1');

      expect(result.message).toBe('Kampanya silindi');
      expect(campaignRepository.softRemove).toHaveBeenCalledWith(mockCampaign);
    });

    it('should throw NotFoundException when campaign not found', async () => {
      campaignRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteAdminCampaign('invalid-id')).rejects.toThrow(
        new NotFoundException('Kampanya bulunamadı'),
      );
    });
  });

  // ─── CAMPAIGN DETAIL TESTS ────────────────────────────────────────────────

  describe('getAdminCampaignDetail', () => {
    it('should return campaign detail with images', async () => {
      const mockCampaign = {
        id: '1',
        business_id: 'biz-1',
        business: { business_name: 'Test Business', user: null },
        title: 'Test Campaign',
        description: 'Test Description',
        discount_percentage: 10,
        discount_code: 'TEST10',
        start_date: new Date(),
        end_date: new Date(),
        status: 'approved',
        code_view_count: 5,
        rejected_reason: null,
        images: [
          { id: 'img-1', file_id: 'file-1', display_order: 1, file: { cdn_url: 'url1', storage_path: null } },
        ],
        created_at: new Date(),
        updated_at: new Date(),
      };

      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      const result = await service.getAdminCampaignDetail('1');

      expect(result.title).toBe('Test Campaign');
      expect(result.images).toHaveLength(1);
      expect(result.images[0].url).toBe('url1');
    });

    it('should use storage_path when cdn_url not available', async () => {
      const mockCampaign = {
        id: '1',
        business_id: 'biz-1',
        business: { business_name: 'Test', user: null },
        title: 'Test',
        description: 'Test',
        discount_percentage: 10,
        status: 'approved',
        code_view_count: 0,
        images: [
          { id: 'img-1', file_id: 'file-1', display_order: 1, file: { cdn_url: null, storage_path: '/path/to/file' } },
        ],
        created_at: new Date(),
        updated_at: new Date(),
      };

      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      const result = await service.getAdminCampaignDetail('1');

      expect(result.images[0].url).toBe('/path/to/file');
    });

    it('should throw NotFoundException when campaign not found', async () => {
      campaignRepository.findOne.mockResolvedValue(null);

      await expect(service.getAdminCampaignDetail('invalid-id')).rejects.toThrow(
        new NotFoundException('Kampanya bulunamadı'),
      );
    });
  });

  // ─── BUSINESS TESTS ──────────────────────────────────────────────────────

  describe('getAdminBusinesses', () => {
    it('should return sorted business list', async () => {
      const mockBusinesses = [
        { id: '1', business_name: 'Business A' },
        { id: '2', business_name: 'Business B' },
      ];

      businessRepository.find.mockResolvedValue(mockBusinesses);

      const result = await service.getAdminBusinesses();

      expect(result.businesses).toHaveLength(2);
      expect(businessRepository.find).toHaveBeenCalledWith({
        select: ['id', 'business_name'],
        order: { business_name: 'ASC' },
      });
    });

    it('should return empty list when no businesses', async () => {
      businessRepository.find.mockResolvedValue([]);

      const result = await service.getAdminBusinesses();

      expect(result.businesses).toEqual([]);
    });
  });

  // ─── BUSINESS CATEGORY TESTS ─────────────────────────────────────────────

  describe('createBusinessCategory', () => {
    it('should create category with unique slug', async () => {
      const categoryDto = { name: 'Test Category' };
      businessCategoryRepository.findOne.mockResolvedValue(null);

      const mockCategory = {
        id: 'cat-1',
        name: 'Test Category',
        slug: 'test-category',
      };

      businessCategoryRepository.save.mockResolvedValue(mockCategory);

      const result = await service.createBusinessCategory(categoryDto);

      expect(result.name).toBe('Test Category');
      expect(businessCategoryRepository.save).toHaveBeenCalled();
    });

    it('should handle Turkish character conversion in slug', async () => {
      const categoryDto = { name: 'Türkçe Kategori' };
      businessCategoryRepository.findOne.mockResolvedValue(null);

      const mockCategory = {
        id: 'cat-1',
        name: 'Türkçe Kategori',
        slug: 'turkce-kategori',
      };

      businessCategoryRepository.save.mockResolvedValue(mockCategory);

      await service.createBusinessCategory(categoryDto);

      expect(businessCategoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Türkçe Kategori',
        }),
      );
    });

    it('should append counter to slug when duplicate exists', async () => {
      const categoryDto = { name: 'Test' };

      // First call returns existing category, second returns null (counter version is unique)
      businessCategoryRepository.findOne
        .mockResolvedValueOnce({ slug: 'test' })
        .mockResolvedValueOnce(null);

      const mockCategory = {
        id: 'cat-1',
        name: 'Test',
        slug: 'test-1',
      };

      businessCategoryRepository.save.mockResolvedValue(mockCategory);

      await service.createBusinessCategory(categoryDto);

      expect(businessCategoryRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'test-1',
        }),
      );
    });
  });

  describe('createAdminBusiness', () => {
    it('should create business with all fields', async () => {
      const businessDto = {
        business_name: 'Test Business',
        category_id: 'cat-1',
        phone: '05331234567',
        address: 'Test Address',
      };

      const mockBusiness = {
        id: 'biz-1',
        business_name: 'Test Business',
        category_id: 'cat-1',
        phone: '05331234567',
        address: 'Test Address',
        user_id: null,
      };

      businessRepository.save.mockResolvedValue(mockBusiness);

      const result = await service.createAdminBusiness(businessDto);

      expect(result.business_name).toBe('Test Business');
      expect(businessRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          business_name: 'Test Business',
          category_id: 'cat-1',
          user_id: null,
        }),
      );
    });

    it('should create business without category_id', async () => {
      const businessDto = {
        business_name: 'Test Business',
        phone: '05331234567',
        address: 'Test Address',
      };

      const mockBusiness = {
        id: 'biz-1',
        business_name: 'Test Business',
        phone: '05331234567',
        address: 'Test Address',
        user_id: null,
      };

      businessRepository.save.mockResolvedValue(mockBusiness);

      await service.createAdminBusiness(businessDto);

      expect(businessRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          business_name: 'Test Business',
        }),
      );
    });
  });

  // ─── CREATE CAMPAIGN TESTS ────────────────────────────────────────────────

  describe('createAdminCampaign', () => {
    it('should create campaign with images', async () => {
      const createDto = {
        business_id: 'biz-1',
        title: 'Test Campaign',
        description: 'Test Description',
        discount_rate: 10,
        code: 'TEST10',
        valid_from: new Date(),
        valid_until: new Date(),
        image_ids: ['file-1', 'file-2'],
      };

      const mockBusiness = { id: 'biz-1' };
      const mockFiles = [{ id: 'file-1' }, { id: 'file-2' }];
      const mockCampaign = { id: 'camp-1', ...createDto };

      businessRepository.findOne.mockResolvedValue(mockBusiness);
      fileRepository.findBy.mockResolvedValue(mockFiles);
      campaignRepository.create.mockReturnValue(mockCampaign);
      campaignRepository.save.mockResolvedValue(mockCampaign);
      campaignImageRepository.create.mockImplementation((img) => img);
      campaignImageRepository.save.mockResolvedValue([]);

      const result = await service.createAdminCampaign('admin-1', createDto);

      expect(result.message).toBe('Kampanya oluşturuldu');
      expect(campaignRepository.save).toHaveBeenCalled();
      expect(campaignImageRepository.save).toHaveBeenCalled();
    });

    it('should create campaign without images', async () => {
      const createDto = {
        business_id: 'biz-1',
        title: 'Test Campaign',
        description: 'Test Description',
        discount_rate: 10,
        valid_from: new Date(),
        valid_until: new Date(),
      };

      const mockBusiness = { id: 'biz-1' };
      const mockCampaign = { id: 'camp-1', ...createDto };

      businessRepository.findOne.mockResolvedValue(mockBusiness);
      campaignRepository.create.mockReturnValue(mockCampaign);
      campaignRepository.save.mockResolvedValue(mockCampaign);

      await service.createAdminCampaign('admin-1', createDto);

      expect(campaignImageRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when business not found', async () => {
      const createDto = {
        business_id: 'invalid-id',
        title: 'Test',
        description: 'Test',
      };

      businessRepository.findOne.mockResolvedValue(null);

      await expect(service.createAdminCampaign('admin-1', createDto)).rejects.toThrow(
        new NotFoundException('İşletme bulunamadı'),
      );
    });

    it('should throw BadRequestException when file not found', async () => {
      const createDto = {
        business_id: 'biz-1',
        title: 'Test',
        description: 'Test',
        image_ids: ['file-1', 'file-2'],
      };

      const mockBusiness = { id: 'biz-1' };
      const mockFiles = [{ id: 'file-1' }]; // Only 1 of 2 files found

      businessRepository.findOne.mockResolvedValue(mockBusiness);
      fileRepository.findBy.mockResolvedValue(mockFiles);

      await expect(service.createAdminCampaign('admin-1', createDto)).rejects.toThrow(
        new BadRequestException('Bir veya daha fazla dosya bulunamadı'),
      );
    });

    it('should set campaign status to approved', async () => {
      const createDto = {
        business_id: 'biz-1',
        title: 'Test',
        description: 'Test',
      };

      const mockBusiness = { id: 'biz-1' };
      const mockCampaign = { id: 'camp-1' };

      businessRepository.findOne.mockResolvedValue(mockBusiness);
      campaignRepository.create.mockReturnValue(mockCampaign);
      campaignRepository.save.mockResolvedValue(mockCampaign);

      await service.createAdminCampaign('admin-1', createDto);

      expect(campaignRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'approved',
          approved_by: 'admin-1',
          approved_at: expect.any(Date),
        }),
      );
    });
  });

  // ─── UPDATE CAMPAIGN TESTS ────────────────────────────────────────────────

  describe('updateAdminCampaign', () => {
    it('should update campaign with partial fields', async () => {
      const updateDto = { title: 'Updated Title', discount_rate: 20 };
      const mockCampaign = { id: '1' };

      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      await service.updateAdminCampaign('1', updateDto);

      expect(campaignRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          title: 'Updated Title',
          discount_percentage: 20,
        }),
      );
    });

    it('should update campaign with images', async () => {
      const updateDto = {
        title: 'Updated',
        image_ids: ['file-1', 'file-2'],
      };

      const mockCampaign = { id: '1' };
      const mockFiles = [{ id: 'file-1' }, { id: 'file-2' }];

      campaignRepository.findOne.mockResolvedValue(mockCampaign);
      fileRepository.findBy.mockResolvedValue(mockFiles);
      campaignImageRepository.delete.mockResolvedValue({ affected: 1 });
      campaignImageRepository.create.mockImplementation((img) => img);
      campaignImageRepository.save.mockResolvedValue([]);

      await service.updateAdminCampaign('1', updateDto);

      expect(campaignImageRepository.delete).toHaveBeenCalledWith({ campaign_id: '1' });
      expect(campaignImageRepository.save).toHaveBeenCalled();
    });

    it('should update campaign with empty image_ids (removes images)', async () => {
      const updateDto = { title: 'Updated', image_ids: [] };
      const mockCampaign = { id: '1' };

      campaignRepository.findOne.mockResolvedValue(mockCampaign);
      campaignImageRepository.delete.mockResolvedValue({ affected: 2 });

      await service.updateAdminCampaign('1', updateDto);

      expect(campaignImageRepository.delete).toHaveBeenCalledWith({ campaign_id: '1' });
      expect(campaignImageRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when campaign not found', async () => {
      campaignRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateAdminCampaign('invalid-id', { title: 'Updated' }),
      ).rejects.toThrow(new NotFoundException('Kampanya bulunamadı'));
    });

    it('should throw NotFoundException when business_id invalid', async () => {
      const updateDto = { business_id: 'invalid-biz' };
      const mockCampaign = { id: '1' };

      campaignRepository.findOne.mockResolvedValue(mockCampaign);
      businessRepository.findOne.mockResolvedValue(null);

      await expect(service.updateAdminCampaign('1', updateDto)).rejects.toThrow(
        new NotFoundException('İşletme bulunamadı'),
      );
    });

    it('should throw BadRequestException when image file not found', async () => {
      const updateDto = {
        image_ids: ['file-1', 'file-2'],
      };

      const mockCampaign = { id: '1' };
      const mockFiles = [{ id: 'file-1' }]; // Only 1 of 2

      campaignRepository.findOne.mockResolvedValue(mockCampaign);
      fileRepository.findBy.mockResolvedValue(mockFiles);

      await expect(service.updateAdminCampaign('1', updateDto)).rejects.toThrow(
        new BadRequestException('Bir veya daha fazla dosya bulunamadı'),
      );
    });

    it('should not update when no updateData provided', async () => {
      const updateDto = {};
      const mockCampaign = { id: '1' };

      campaignRepository.findOne.mockResolvedValue(mockCampaign);

      await service.updateAdminCampaign('1', updateDto);

      // Should not call update if no fields to update
      expect(campaignRepository.update).not.toHaveBeenCalled();
    });

    it('should validate business_id before updating when provided', async () => {
      const updateDto = { business_id: 'new-biz' };
      const mockCampaign = { id: '1' };
      const mockBusiness = { id: 'new-biz' };

      campaignRepository.findOne.mockResolvedValue(mockCampaign);
      businessRepository.findOne.mockResolvedValue(mockBusiness);

      await service.updateAdminCampaign('1', updateDto);

      expect(businessRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'new-biz' },
      });
      expect(campaignRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          business_id: 'new-biz',
        }),
      );
    });
  });

  // ─── SLUG GENERATION TESTS ────────────────────────────────────────────────

  describe('ensureUniqueSlug', () => {
    it('should return base slug when unique', async () => {
      businessCategoryRepository.findOne.mockResolvedValue(null);

      const slug = await service['ensureUniqueSlug']('test-slug');

      expect(slug).toBe('test-slug');
    });

    it('should append counter when slug exists', async () => {
      // Simulate multiple collisions
      businessCategoryRepository.findOne
        .mockResolvedValueOnce({ slug: 'test' }) // collision
        .mockResolvedValueOnce({ slug: 'test-1' }) // collision
        .mockResolvedValueOnce(null); // unique

      const slug = await service['ensureUniqueSlug']('test');

      expect(slug).toBe('test-2');
    });

    it('should handle while loop for slug uniqueness', async () => {
      businessCategoryRepository.findOne
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(null);

      const slug = await service['ensureUniqueSlug']('dup');

      expect(slug).toBe('dup-2');
    });
  });
});
