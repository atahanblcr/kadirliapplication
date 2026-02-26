import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';
import { DeathNotice, Cemetery, Mosque } from '../database/entities/death-notice.entity';
import { Campaign, CampaignImage } from '../database/entities/campaign.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { Business } from '../database/entities/business.entity';
import { BusinessCategory } from '../database/entities/business-category.entity';
import { FileEntity } from '../database/entities/file.entity';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { Event, EventImage } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';
import { Place, PlaceCategory, PlaceImage } from '../database/entities/place.entity';
import { Complaint } from '../database/entities/complaint.entity';

// ─── QueryBuilder mock'ları ──────────────────────────────────────────────────

/** select/filter + getMany */
function makeSelectQb(data: any[] = []) {
  const qb: any = {};
  const chain = [
    'leftJoinAndSelect',
    'where',
    'andWhere',
    'orderBy',
    'addOrderBy',
    'skip',
    'take',
  ];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getMany = jest.fn().mockResolvedValue(data);
  qb.getManyAndCount = jest.fn().mockResolvedValue([data, data.length]);
  qb.getOne = jest.fn().mockResolvedValue(data[0] || null);
  return qb;
}

/** getCount */
function makeCountQb(count = 0) {
  const qb: any = {};
  const chain = ['where', 'andWhere'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getCount = jest.fn().mockResolvedValue(count);
  return qb;
}

/** getRawMany (user_growth chart) */
function makeRawQb(data: any[] = []) {
  const qb: any = {};
  const chain = ['select', 'addSelect', 'where', 'groupBy', 'orderBy'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getRawMany = jest.fn().mockResolvedValue(data);
  return qb;
}

// ─── Fabrikalar ──────────────────────────────────────────────────────────────

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-uuid-1',
    phone: '05331234567',
    username: 'testuser',
    is_banned: false,
    is_active: true,
    created_at: new Date('2026-01-01'),
    ...overrides,
  } as User);

const makeAd = (overrides: Partial<Ad> = {}): Ad =>
  ({
    id: 'ad-uuid-1',
    title: 'iPhone 13 Pro Max',
    user_id: 'user-uuid-1',
    status: 'pending',
    created_at: new Date('2026-02-20T08:00:00Z'),
    user: makeUser(),
    ...overrides,
  } as Ad);

const makeDeath = (overrides: Partial<DeathNotice> = {}): DeathNotice =>
  ({
    id: 'death-uuid-1',
    deceased_name: 'Ahmet Yılmaz',
    status: 'pending',
    created_at: new Date('2026-02-20T09:00:00Z'),
    adder: makeUser(),
    cemetery_id: 'cem-1',
    mosque_id: 'mosque-1',
    neighborhood_id: 'neigh-1',
    funeral_date: '2026-02-22',
    funeral_time: '14:00',
    age: 75,
    condolence_address: 'Ahmet Bey Mahallesi 123',
    ...overrides,
  } as DeathNotice);

const makeCampaign = (overrides: Partial<Campaign> = {}): Campaign =>
  ({
    id: 'campaign-uuid-1',
    title: '%20 İndirim',
    status: 'pending',
    created_at: new Date('2026-02-20T10:00:00Z'),
    business: { user: makeUser() } as any,
    discount_percentage: 20,
    business_id: 'business-1',
    images: [],
    ...overrides,
  } as Campaign);

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('AdminService', () => {
  let service: AdminService;
  let userRepo: any;
  let adRepo: any;
  let deathRepo: any;
  let campaignRepo: any;
  let announcementRepo: any;
  let notifRepo: any;
  let pharmRepo: any;
  let businessRepo: any;
  let businessCategoryRepo: any;
  let cemeteryRepo: any;
  let mosqueRepo: any;
  let neighborhoodRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      softDelete: jest.fn(),
      softRemove: jest.fn(),
      remove: jest.fn(),
      find: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getRepositoryToken(User), useFactory: mockRepo },
        { provide: getRepositoryToken(Ad), useFactory: mockRepo },
        { provide: getRepositoryToken(DeathNotice), useFactory: mockRepo },
        { provide: getRepositoryToken(Campaign), useFactory: mockRepo },
        { provide: getRepositoryToken(Announcement), useFactory: mockRepo },
        { provide: getRepositoryToken(Notification), useFactory: mockRepo },
        { provide: getRepositoryToken(Pharmacy), useFactory: mockRepo },
        { provide: getRepositoryToken(PharmacySchedule), useFactory: mockRepo },
        { provide: getRepositoryToken(IntercityRoute), useFactory: mockRepo },
        { provide: getRepositoryToken(IntercitySchedule), useFactory: mockRepo },
        { provide: getRepositoryToken(IntracityRoute), useFactory: mockRepo },
        { provide: getRepositoryToken(IntracityStop), useFactory: mockRepo },
        { provide: getRepositoryToken(Cemetery), useFactory: mockRepo },
        { provide: getRepositoryToken(Mosque), useFactory: mockRepo },
        { provide: getRepositoryToken(Neighborhood), useFactory: mockRepo },
        { provide: getRepositoryToken(Business), useFactory: mockRepo },
        { provide: getRepositoryToken(BusinessCategory), useFactory: mockRepo },
        { provide: getRepositoryToken(CampaignImage), useFactory: mockRepo },
        { provide: getRepositoryToken(FileEntity), useFactory: mockRepo },
        { provide: getRepositoryToken(TaxiDriver), useFactory: mockRepo },
        { provide: getRepositoryToken(Event), useFactory: mockRepo },
        { provide: getRepositoryToken(EventImage), useFactory: mockRepo },
        { provide: getRepositoryToken(EventCategory), useFactory: mockRepo },
        { provide: getRepositoryToken(GuideCategory), useFactory: mockRepo },
        { provide: getRepositoryToken(GuideItem), useFactory: mockRepo },
        { provide: getRepositoryToken(PlaceCategory), useFactory: mockRepo },
        { provide: getRepositoryToken(Place), useFactory: mockRepo },
        { provide: getRepositoryToken(PlaceImage), useFactory: mockRepo },
        { provide: getRepositoryToken(Complaint), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    userRepo = module.get(getRepositoryToken(User));
    adRepo = module.get(getRepositoryToken(Ad));
    deathRepo = module.get(getRepositoryToken(DeathNotice));
    campaignRepo = module.get(getRepositoryToken(Campaign));
    announcementRepo = module.get(getRepositoryToken(Announcement));
    notifRepo = module.get(getRepositoryToken(Notification));
    pharmRepo = module.get(getRepositoryToken(Pharmacy));
    businessRepo = module.get(getRepositoryToken(Business));
    businessCategoryRepo = module.get(getRepositoryToken(BusinessCategory));
    cemeteryRepo = module.get(getRepositoryToken(Cemetery));
    mosqueRepo = module.get(getRepositoryToken(Mosque));
    neighborhoodRepo = module.get(getRepositoryToken(Neighborhood));
  });

  afterEach(() => jest.clearAllMocks());

  // ── getDashboard ──────────────────────────────────────────────────────────

  describe('getDashboard', () => {
    beforeEach(() => {
      // count calls
      userRepo.count.mockResolvedValue(1000);
      adRepo.count.mockResolvedValue(5);
      deathRepo.count.mockResolvedValue(2);
      campaignRepo.count.mockResolvedValue(3);

      // QB for new_ads_today
      const adQb = makeCountQb(10);
      // QB for announcements_today
      const annQb = makeCountQb(2);
      adRepo.createQueryBuilder.mockReturnValue(adQb);
      announcementRepo.createQueryBuilder.mockReturnValue(annQb);

      // QB for user_growth
      const userQb = makeRawQb([
        { date: '2026-02-19', count: '5' },
        { date: '2026-02-20', count: '8' },
      ]);
      userRepo.createQueryBuilder.mockReturnValue(userQb);
    });

    it('stats döndürmeli', async () => {
      const result = await service.getDashboard();

      expect(result.stats.total_users).toBe(1000);
      expect(result.stats.pending_approvals.ads).toBe(5);
      expect(result.stats.pending_approvals.deaths).toBe(2);
      expect(result.stats.pending_approvals.campaigns).toBe(3);
    });

    it('pending_approvals.total toplamı doğru hesaplamalı', async () => {
      const result = await service.getDashboard();

      expect(result.stats.pending_approvals.total).toBe(10); // 5+2+3
    });

    it('new_ads_today ve announcements_sent_today döndürmeli', async () => {
      const result = await service.getDashboard();

      expect(result.stats.new_ads_today).toBe(10);
      expect(result.stats.announcements_sent_today).toBe(2);
    });

    it('user_growth chart verisi döndürmeli', async () => {
      const result = await service.getDashboard();

      expect(result.charts.user_growth).toHaveLength(2);
      expect(result.charts.user_growth[0]).toEqual({ date: '2026-02-19', count: 5 });
    });

    it('boş user_growth döndürmeli', async () => {
      userRepo.createQueryBuilder.mockReturnValue(makeRawQb([]));

      const result = await service.getDashboard();

      expect(result.charts.user_growth).toEqual([]);
    });
  });

  // ── getApprovals ──────────────────────────────────────────────────────────

  describe('getApprovals', () => {
    it('type=ad olduğunda sadece ilan bekleyenleri döndürmeli', async () => {
      const qb = makeSelectQb([makeAd()]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'ad' });

      expect(result.approvals).toHaveLength(1);
      expect(result.approvals[0].type).toBe('ad');
      expect(deathRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('type=death olduğunda sadece vefat bekleyenleri döndürmeli', async () => {
      const qb = makeSelectQb([makeDeath()]);
      deathRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'death' });

      expect(result.approvals).toHaveLength(1);
      expect(result.approvals[0].type).toBe('death');
      expect(adRepo.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('type=campaign olduğunda sadece kampanya bekleyenleri döndürmeli', async () => {
      const qb = makeSelectQb([makeCampaign()]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'campaign' });

      expect(result.approvals).toHaveLength(1);
      expect(result.approvals[0].type).toBe('campaign');
    });

    it('type verilmediğinde tüm türleri birleştirmeli', async () => {
      adRepo.createQueryBuilder.mockReturnValue(makeSelectQb([makeAd()]));
      deathRepo.createQueryBuilder.mockReturnValue(makeSelectQb([makeDeath()]));
      campaignRepo.createQueryBuilder.mockReturnValue(
        makeSelectQb([makeCampaign()]),
      );

      const result = await service.getApprovals({});

      expect(result.approvals).toHaveLength(3);
      expect(result.total).toBe(3);
    });

    it('hours_pending pozitif sayı olmalı', async () => {
      const qb = makeSelectQb([makeAd()]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'ad' });

      expect(typeof result.approvals[0].hours_pending).toBe('number');
      expect(result.approvals[0].hours_pending).toBeGreaterThanOrEqual(0);
    });

    it('content.title ad başlığını içermeli', async () => {
      const qb = makeSelectQb([makeAd({ title: 'Satılık Araba' })]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'ad' });

      expect(result.approvals[0].content.title).toBe('Satılık Araba');
    });

    it('death için content.title deceased_name olmalı', async () => {
      const qb = makeSelectQb([makeDeath({ deceased_name: 'Mehmet Kaya' })]);
      deathRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'death' });

      expect(result.approvals[0].content.title).toBe('Mehmet Kaya');
    });

    it('boş liste döndürmeli', async () => {
      adRepo.createQueryBuilder.mockReturnValue(makeSelectQb([]));
      deathRepo.createQueryBuilder.mockReturnValue(makeSelectQb([]));
      campaignRepo.createQueryBuilder.mockReturnValue(makeSelectQb([]));

      const result = await service.getApprovals({});

      expect(result.approvals).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  // ── getAdminAds ────────────────────────────────────────────────────────────

  describe('getAdminAds', () => {
    it('ilan listesini döndürmeli', async () => {
      const ads = [makeAd()];
      const qb = makeSelectQb(ads);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAdminAds({ page: 1, limit: 20 });

      expect(result.ads).toEqual(ads);
      expect(result.meta.total).toBe(1);
      expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('ad.user', 'user');
      expect(qb.where).toHaveBeenCalledWith('ad.deleted_at IS NULL');
    });

    it('status filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminAds({ status: 'pending' });

      expect(qb.andWhere).toHaveBeenCalledWith('ad.status = :status', {
        status: 'pending',
      });
    });

    it('category_id filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminAds({ category_id: 'cat-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalledWith('ad.category_id = :category_id', {
        category_id: 'cat-uuid-1',
      });
    });

    it('user_id filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminAds({ user_id: 'user-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalledWith('ad.user_id = :user_id', {
        user_id: 'user-uuid-1',
      });
    });

    it('search filtresi (title ve description) uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminAds({ search: 'iPhone' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(ad.title ILIKE :search OR ad.description ILIKE :search)',
        { search: '%iPhone%' },
      );
    });
  });

  // ── approveAd ──────────────────────────────────────────────────────────────

  describe('approveAd', () => {
    it('ilan onaylanmalı ve güncellenmeli', async () => {
      adRepo.findOne.mockResolvedValue(makeAd());
      adRepo.update.mockResolvedValue({ affected: 1 });
      const notif = { id: 'notif-1' };
      notifRepo.create.mockReturnValue(notif);
      notifRepo.save.mockResolvedValue(notif);

      const result = await service.approveAd('admin-uuid', 'ad-uuid-1');

      expect(adRepo.update).toHaveBeenCalledWith('ad-uuid-1', {
        status: 'approved',
        approved_by: 'admin-uuid',
        approved_at: expect.any(Date),
      });
      expect(result).toEqual({ message: 'İlan onaylandı' });
    });

    it('bildirim oluşturulmalı', async () => {
      adRepo.findOne.mockResolvedValue(makeAd({ user_id: 'user-uuid-1' }));
      adRepo.update.mockResolvedValue({ affected: 1 });
      notifRepo.create.mockReturnValue({});
      notifRepo.save.mockResolvedValue({});

      await service.approveAd('admin-uuid', 'ad-uuid-1');

      expect(notifRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-uuid-1',
          type: 'ad_approved',
          related_type: 'ad',
        }),
      );
    });

    it('ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(service.approveAd('admin-uuid', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── rejectAd ───────────────────────────────────────────────────────────────

  describe('rejectAd', () => {
    it('ilan reddedilmeli ve güncellenmeli', async () => {
      adRepo.findOne.mockResolvedValue(makeAd());
      adRepo.update.mockResolvedValue({ affected: 1 });
      notifRepo.create.mockReturnValue({});
      notifRepo.save.mockResolvedValue({});

      const result = await service.rejectAd('admin-uuid', 'ad-uuid-1', {
        rejected_reason: 'Hatalı bilgiler',
      });

      expect(adRepo.update).toHaveBeenCalledWith('ad-uuid-1', {
        status: 'rejected',
        rejected_reason: 'Hatalı bilgiler',
        rejected_at: expect.any(Date),
      });
      expect(result).toEqual({ message: 'İlan reddedildi' });
    });

    it('red bildirimi oluşturulmalı', async () => {
      adRepo.findOne.mockResolvedValue(makeAd({ user_id: 'user-uuid-1' }));
      adRepo.update.mockResolvedValue({ affected: 1 });
      notifRepo.create.mockReturnValue({});
      notifRepo.save.mockResolvedValue({});

      await service.rejectAd('admin-uuid', 'ad-uuid-1', {
        rejected_reason: 'Spam',
      });

      expect(notifRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-uuid-1',
          type: 'ad_rejected',
        }),
      );
    });

    it('ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(
        service.rejectAd('admin-uuid', 'nonexistent', {
          rejected_reason: 'Spam',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
