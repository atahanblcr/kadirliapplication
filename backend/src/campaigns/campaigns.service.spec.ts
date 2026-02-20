import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import {
  Campaign,
  CampaignImage,
  CampaignCodeView,
} from '../database/entities/campaign.entity';
import { Business } from '../database/entities/business.entity';

// ─── QueryBuilder mock ──────────────────────────────────────────────────────

function makeListQb(data: any[] = [], total = 0) {
  const qb: any = {};
  const chain = [
    'leftJoinAndSelect', 'where', 'andWhere',
    'orderBy', 'skip', 'take',
  ];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getManyAndCount = jest.fn().mockResolvedValue([data, total]);
  qb.getCount = jest.fn().mockResolvedValue(0);
  return qb;
}

function makeUpdateQb() {
  const qb: any = {};
  ['update', 'set', 'where'].forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.execute = jest.fn().mockResolvedValue({ affected: 1 });
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeBusiness = (overrides: Partial<Business> = {}): Business =>
  ({
    id: 'biz-uuid-1',
    user_id: 'user-uuid-1',
    business_name: 'Merkez Kafe',
    category: { id: 'bizcat-uuid-1', name: 'Yeme-İçme' },
    ...overrides,
  } as Business);

const makeCampaign = (overrides: Partial<Campaign> = {}): Campaign =>
  ({
    id: 'camp-uuid-1',
    business_id: 'biz-uuid-1',
    business: {
      id: 'biz-uuid-1',
      business_name: 'Merkez Kafe',
      category: { name: 'Yeme-İçme' },
    },
    title: 'Kahvelerde %50 İndirim',
    description: 'Tüm kahvelerde geçerli',
    discount_percentage: 50,
    discount_code: 'KAHVE50',
    terms: 'Sadece Pazartesi-Çarşamba geçerli',
    start_date: '2026-02-15',
    end_date: '2026-02-28',
    status: 'approved',
    code_view_count: 10,
    created_at: new Date('2026-02-10'),
    ...overrides,
  } as Campaign);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('CampaignsService', () => {
  let service: CampaignsService;
  let campaignRepo: any;
  let campaignImageRepo: any;
  let codeViewRepo: any;
  let businessRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((dto: any) => dto),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        { provide: getRepositoryToken(Campaign), useFactory: mockRepo },
        { provide: getRepositoryToken(CampaignImage), useFactory: mockRepo },
        { provide: getRepositoryToken(CampaignCodeView), useFactory: mockRepo },
        { provide: getRepositoryToken(Business), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
    campaignRepo = module.get(getRepositoryToken(Campaign));
    campaignImageRepo = module.get(getRepositoryToken(CampaignImage));
    codeViewRepo = module.get(getRepositoryToken(CampaignCodeView));
    businessRepo = module.get(getRepositoryToken(Business));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('aktif kampanyaları sayfalı döndürmeli', async () => {
      const campaigns = [makeCampaign()];
      const qb = makeListQb(campaigns, 1);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.campaigns).toEqual(campaigns);
      expect(result.meta.total).toBe(1);
    });

    it('status=approved filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.where).toHaveBeenCalledWith('c.status = :status', { status: 'approved' });
    });

    it('deleted_at IS NULL filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.andWhere).toHaveBeenCalledWith('c.deleted_at IS NULL');
    });

    it('varsayılan olarak aktif tarih filtresi uygulanmalı (start_date <= TODAY)', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      const today = new Date().toISOString().slice(0, 10);
      expect(qb.andWhere).toHaveBeenCalledWith('c.start_date <= :today', { today });
    });

    it('varsayılan olarak aktif tarih filtresi uygulanmalı (end_date >= TODAY)', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      const today = new Date().toISOString().slice(0, 10);
      expect(qb.andWhere).toHaveBeenCalledWith('c.end_date >= :today', { today });
    });

    it('active_only=false olduğunda tarih filtreleri uygulanmamalı', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ active_only: false });

      const calls = (qb.andWhere as jest.Mock).mock.calls.map((c: any) => c[0]);
      expect(calls).not.toContain(expect.stringContaining('start_date'));
      expect(calls).not.toContain(expect.stringContaining('end_date'));
    });

    it('category_id filtresi uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({ category_id: 'bizcat-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'business.category_id = :category_id',
        { category_id: 'bizcat-uuid-1' },
      );
    });

    it('category_id verilmediğinde filtre uygulanmamalı', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      const calls = (qb.andWhere as jest.Mock).mock.calls.map((c: any) => c[0]);
      expect(calls).not.toContain(
        expect.stringContaining('business.category_id'),
      );
    });

    it('DESC created_at sıralaması uygulanmalı', async () => {
      const qb = makeListQb([], 0);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.findAll({});

      expect(qb.orderBy).toHaveBeenCalledWith('c.created_at', 'DESC');
    });
  });

  // ── findOne ───────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('kampanya detayını döndürmeli', async () => {
      const campaign = makeCampaign();
      campaignRepo.findOne.mockResolvedValue(campaign);

      const result = await service.findOne('camp-uuid-1');

      expect(result.campaign).toBe(campaign);
      expect(campaignRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'camp-uuid-1', status: 'approved' },
        relations: [
          'business',
          'business.category',
          'cover_image',
          'images',
          'images.file',
        ],
      });
    });

    it('kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  // ── viewCode ──────────────────────────────────────────────────────────────

  describe('viewCode', () => {
    it('indirim kodunu ve şartlarını döndürmeli', async () => {
      const campaign = makeCampaign();
      campaignRepo.findOne.mockResolvedValue(campaign);
      codeViewRepo.save.mockResolvedValue({});
      const updateQb = makeUpdateQb();
      campaignRepo.createQueryBuilder.mockReturnValue(updateQb);

      const result = await service.viewCode('user-uuid-1', 'camp-uuid-1');

      expect(result.discount_code).toBe('KAHVE50');
      expect(result.terms).toBe('Sadece Pazartesi-Çarşamba geçerli');
    });

    it('campaign_code_views kaydı oluşturulmalı', async () => {
      const campaign = makeCampaign();
      campaignRepo.findOne.mockResolvedValue(campaign);
      codeViewRepo.save.mockResolvedValue({});
      const updateQb = makeUpdateQb();
      campaignRepo.createQueryBuilder.mockReturnValue(updateQb);

      await service.viewCode('user-uuid-1', 'camp-uuid-1');

      expect(codeViewRepo.create).toHaveBeenCalledWith({
        campaign_id: 'camp-uuid-1',
        user_id: 'user-uuid-1',
      });
      expect(codeViewRepo.save).toHaveBeenCalled();
    });

    it('code_view_count atomik artırılmalı', async () => {
      const campaign = makeCampaign();
      campaignRepo.findOne.mockResolvedValue(campaign);
      codeViewRepo.save.mockResolvedValue({});
      const updateQb = makeUpdateQb();
      campaignRepo.createQueryBuilder.mockReturnValue(updateQb);

      await service.viewCode('user-uuid-1', 'camp-uuid-1');

      expect(updateQb.set).toHaveBeenCalledWith({
        code_view_count: expect.any(Function),
      });
      expect(updateQb.where).toHaveBeenCalledWith('id = :id', { id: 'camp-uuid-1' });
      expect(updateQb.execute).toHaveBeenCalled();
    });

    it('kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.viewCode('user-uuid-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    const validDto = {
      title: 'Kahvelerde %50 İndirim',
      description: 'Tüm kahvelerde geçerli',
      discount_percentage: 50,
      discount_code: 'KAHVE50',
      start_date: '2026-02-15',
      end_date: '2026-02-28',
      image_ids: ['file-uuid-1', 'file-uuid-2'],
      cover_image_id: 'file-uuid-1',
    };

    it('kampanya başarıyla oluşturulmalı (status=pending)', async () => {
      businessRepo.findOne.mockResolvedValue(makeBusiness());
      const monthlyQb = makeListQb([], 0);
      monthlyQb.getCount.mockResolvedValue(0);
      campaignRepo.createQueryBuilder.mockReturnValue(monthlyQb);
      campaignRepo.save.mockResolvedValue({
        id: 'new-camp',
        status: 'pending',
      });
      campaignImageRepo.save.mockResolvedValue([]);

      const result = await service.create('user-uuid-1', validDto);

      expect(result.campaign.status).toBe('pending');
      expect(result.campaign.id).toBe('new-camp');
      expect(result.campaign.message).toBe('Kampanyanız incelemeye alındı.');
    });

    it('kampanya görselleri kaydedilmeli', async () => {
      businessRepo.findOne.mockResolvedValue(makeBusiness());
      const monthlyQb = makeListQb([], 0);
      monthlyQb.getCount.mockResolvedValue(0);
      campaignRepo.createQueryBuilder.mockReturnValue(monthlyQb);
      campaignRepo.save.mockResolvedValue({ id: 'new-camp', status: 'pending' });
      campaignImageRepo.save.mockResolvedValue([]);

      await service.create('user-uuid-1', validDto);

      expect(campaignImageRepo.create).toHaveBeenCalledTimes(2);
      expect(campaignImageRepo.save).toHaveBeenCalled();
    });

    it('işletme hesabı bulunamazsa ForbiddenException fırlatmalı', async () => {
      businessRepo.findOne.mockResolvedValue(null);

      await expect(service.create('user-uuid-1', validDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('start_date > end_date ise BadRequestException fırlatmalı', async () => {
      businessRepo.findOne.mockResolvedValue(makeBusiness());
      const invalidDto = {
        ...validDto,
        start_date: '2026-03-01',
        end_date: '2026-02-01',
      };

      await expect(service.create('user-uuid-1', invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('aylık 5 kampanya limitini aşınca BadRequestException fırlatmalı', async () => {
      businessRepo.findOne.mockResolvedValue(makeBusiness());
      const monthlyQb = makeListQb([], 5);
      monthlyQb.getCount.mockResolvedValue(5);
      campaignRepo.createQueryBuilder.mockReturnValue(monthlyQb);

      await expect(service.create('user-uuid-1', validDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('cover_image_id verilmezse image_ids[0] kullanılmalı', async () => {
      businessRepo.findOne.mockResolvedValue(makeBusiness());
      const monthlyQb = makeListQb([], 0);
      monthlyQb.getCount.mockResolvedValue(0);
      campaignRepo.createQueryBuilder.mockReturnValue(monthlyQb);
      campaignRepo.save.mockResolvedValue({ id: 'new-camp', status: 'pending' });
      campaignImageRepo.save.mockResolvedValue([]);

      const dtoWithoutCover = { ...validDto, cover_image_id: undefined };
      await service.create('user-uuid-1', dtoWithoutCover);

      const createdArg = campaignRepo.create.mock.calls[0][0];
      expect(createdArg.cover_image_id).toBe('file-uuid-1');
    });

    it('görsel display_order sıra numarasıyla kaydedilmeli', async () => {
      businessRepo.findOne.mockResolvedValue(makeBusiness());
      const monthlyQb = makeListQb([], 0);
      monthlyQb.getCount.mockResolvedValue(0);
      campaignRepo.createQueryBuilder.mockReturnValue(monthlyQb);
      campaignRepo.save.mockResolvedValue({ id: 'new-camp', status: 'pending' });
      campaignImageRepo.save.mockResolvedValue([]);

      await service.create('user-uuid-1', validDto);

      const firstImage = campaignImageRepo.create.mock.calls[0][0];
      const secondImage = campaignImageRepo.create.mock.calls[1][0];
      expect(firstImage.display_order).toBe(0);
      expect(secondImage.display_order).toBe(1);
    });
  });
});
