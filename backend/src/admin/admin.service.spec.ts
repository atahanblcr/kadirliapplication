import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminService } from './admin.service';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';
import {
  DeathNotice,
  Cemetery,
  Mosque,
} from '../database/entities/death-notice.entity';
import { Campaign, CampaignImage } from '../database/entities/campaign.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
import {
  Pharmacy,
  PharmacySchedule,
} from '../database/entities/pharmacy.entity';
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
import {
  Place,
  PlaceCategory,
  PlaceImage,
} from '../database/entities/place.entity';
import { Complaint } from '../database/entities/complaint.entity';

jest.mock('bcrypt');

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
  }) as User;

const makeAd = (overrides: Partial<Ad> = {}): Ad =>
  ({
    id: 'ad-uuid-1',
    title: 'iPhone 13 Pro Max',
    user_id: 'user-uuid-1',
    status: 'pending',
    created_at: new Date('2026-02-20T08:00:00Z'),
    user: makeUser(),
    ...overrides,
  }) as Ad;

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
  }) as DeathNotice;

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
  }) as Campaign;

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
  let neighborhoodRepo: any;
  let eventRepo: any;
  let taxiDriverRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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
        {
          provide: getRepositoryToken(IntercitySchedule),
          useFactory: mockRepo,
        },
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
    neighborhoodRepo = module.get(getRepositoryToken(Neighborhood));
    eventRepo = module.get(getRepositoryToken(Event));
    taxiDriverRepo = module.get(getRepositoryToken(TaxiDriver));
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
      expect(result.charts.user_growth[0]).toEqual({
        date: '2026-02-19',
        count: 5,
      });
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

      expect(qb.andWhere).toHaveBeenCalledWith(
        'ad.category_id = :category_id',
        {
          category_id: 'cat-uuid-1',
        },
      );
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

      await expect(
        service.approveAd('admin-uuid', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
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

  // ── getNeighborhoods ──────────────────────────────────────────────────────

  describe('getNeighborhoods', () => {
    it('mahalle listesini ve pagination meta döndürmeli', async () => {
      const neighborhoods = [
        { id: 'n-1', name: 'Cumhuriyet', type: 'mahalle', is_active: true },
      ];
      const qb = makeSelectQb(neighborhoods);
      neighborhoodRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getNeighborhoods();

      expect(qb.orderBy).toHaveBeenCalledWith('n.display_order', 'ASC');
      expect(qb.addOrderBy).toHaveBeenCalledWith('n.name', 'ASC');
      expect(result.neighborhoods).toEqual(neighborhoods);
      expect(result.meta).toEqual(
        expect.objectContaining({ total: 1, page: 1, limit: 50 }),
      );
    });

    it('search filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      neighborhoodRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getNeighborhoods('cumhur');

      expect(qb.andWhere).toHaveBeenCalledWith('n.name ILIKE :search', {
        search: '%cumhur%',
      });
    });

    it('type filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      neighborhoodRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getNeighborhoods(undefined, 'mahalle');

      expect(qb.andWhere).toHaveBeenCalledWith('n.type = :type', {
        type: 'mahalle',
      });
    });

    it('is_active filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      neighborhoodRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getNeighborhoods(undefined, undefined, false);

      expect(qb.andWhere).toHaveBeenCalledWith('n.is_active = :is_active', {
        is_active: false,
      });
    });

    it('is_active undefined olduğunda filtre uygulanmamalı', async () => {
      const qb = makeSelectQb([]);
      neighborhoodRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getNeighborhoods();

      expect(qb.andWhere).not.toHaveBeenCalledWith(
        expect.stringContaining('is_active'),
        expect.anything(),
      );
    });

    it('page/limit ile skip/take hesaplanmalı', async () => {
      const qb = makeSelectQb([]);
      neighborhoodRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getNeighborhoods(undefined, undefined, undefined, 3, 10);

      expect(qb.skip).toHaveBeenCalledWith(20);
      expect(qb.take).toHaveBeenCalledWith(10);
    });
  });

  // ── createNeighborhood ────────────────────────────────────────────────────

  describe('createNeighborhood', () => {
    it('mahalle oluşturulmalı', async () => {
      const dto = { name: 'Yeni Mahalle', type: 'mahalle' };
      const created = { ...dto };
      const saved = { id: 'n-new', ...dto };
      neighborhoodRepo.create.mockReturnValue(created);
      neighborhoodRepo.save.mockResolvedValue(saved);

      const result = await service.createNeighborhood(dto);

      expect(neighborhoodRepo.create).toHaveBeenCalledWith(dto);
      expect(neighborhoodRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual({ neighborhood: saved });
    });
  });

  // ── updateNeighborhood ─────────────────────────────────────────────────────

  describe('updateNeighborhood', () => {
    it('mahalle güncellenmeli', async () => {
      const existing = { id: 'n-1', name: 'Eski Ad', type: 'mahalle' };
      neighborhoodRepo.findOne.mockResolvedValue(existing);
      neighborhoodRepo.save.mockResolvedValue({ ...existing, name: 'Yeni Ad' });

      const result = await service.updateNeighborhood('n-1', {
        name: 'Yeni Ad',
      });

      expect(neighborhoodRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Yeni Ad' }),
      );
      expect(result.neighborhood.name).toBe('Yeni Ad');
    });

    it('mahalle bulunamazsa NotFoundException fırlatmalı', async () => {
      neighborhoodRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateNeighborhood('nonexistent', { name: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── deleteNeighborhood ─────────────────────────────────────────────────────

  describe('deleteNeighborhood', () => {
    it('mahalle silinmeli', async () => {
      neighborhoodRepo.findOne.mockResolvedValue({ id: 'n-1' });
      neighborhoodRepo.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteNeighborhood('n-1');

      expect(neighborhoodRepo.delete).toHaveBeenCalledWith('n-1');
      expect(result).toEqual({ message: 'Mahalle silindi' });
    });

    it('mahalle bulunamazsa NotFoundException fırlatmalı', async () => {
      neighborhoodRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteNeighborhood('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── deleteAdAsAdmin ────────────────────────────────────────────────────────

  describe('deleteAdAsAdmin', () => {
    it('ilan silinmeli', async () => {
      adRepo.findOne.mockResolvedValue(makeAd());

      const result = await service.deleteAdAsAdmin('ad-uuid-1');

      expect(adRepo.softDelete).toHaveBeenCalledWith('ad-uuid-1');
      expect(result).toEqual({ message: 'İlan silindi' });
    });

    it('ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(service.deleteAdAsAdmin('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── getModuleUsage ─────────────────────────────────────────────────────────

  describe('getModuleUsage', () => {
    it("modül kullanım sayılarını count'a göre azalan sırada döndürmeli", async () => {
      adRepo.count.mockResolvedValue(5);
      announcementRepo.count.mockResolvedValue(2);
      deathRepo.count.mockResolvedValue(1);
      campaignRepo.count.mockResolvedValue(20);
      pharmRepo.count.mockResolvedValue(3);
      taxiDriverRepo.count.mockResolvedValue(8);
      eventRepo.count.mockResolvedValue(0);

      const result = await service.getModuleUsage();

      expect(result[0]).toEqual({ name: 'Kampanyalar', count: 20 });
      expect(result[result.length - 1]).toEqual({
        name: 'Etkinlikler',
        count: 0,
      });
      expect(result).toHaveLength(7);
    });
  });

  // ── getRecentActivities ────────────────────────────────────────────────────

  describe('getRecentActivities', () => {
    it('son aktiviteleri tüm kaynaklardan birleştirip tarihe göre sıralamalı', async () => {
      adRepo.find.mockResolvedValue([
        makeAd({ id: 'ad-1', created_at: new Date('2026-02-20T10:00:00Z') }),
      ]);
      announcementRepo.find.mockResolvedValue([
        {
          id: 'ann-1',
          title: 'Duyuru',
          created_at: new Date('2026-02-21T10:00:00Z'),
        },
      ]);
      deathRepo.find.mockResolvedValue([
        makeDeath({
          id: 'death-1',
          created_at: new Date('2026-02-19T10:00:00Z'),
        }),
      ]);
      userRepo.find.mockResolvedValue([
        makeUser({
          id: 'user-2',
          username: 'yeniuye',
          created_at: new Date('2026-02-22T10:00:00Z'),
        }),
      ]);

      const result = await service.getRecentActivities();

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual(
        expect.objectContaining({ id: 'user-2', type: 'user_register' }),
      );
      expect(result[result.length - 1]).toEqual(
        expect.objectContaining({ id: 'death-1', type: 'death_notice' }),
      );
    });

    it('en fazla 10 aktivite döndürmeli', async () => {
      const manyAds = Array.from({ length: 5 }, (_, i) =>
        makeAd({
          id: `ad-${i}`,
          created_at: new Date(`2026-02-${10 + i}T10:00:00Z`),
        }),
      );
      const manyAnnouncements = Array.from({ length: 4 }, (_, i) => ({
        id: `ann-${i}`,
        title: 'Duyuru',
        created_at: new Date(`2026-02-${10 + i}T11:00:00Z`),
      }));
      const manyDeaths = Array.from({ length: 3 }, (_, i) =>
        makeDeath({
          id: `death-${i}`,
          created_at: new Date(`2026-02-${10 + i}T12:00:00Z`),
        }),
      );
      const manyUsers = Array.from({ length: 3 }, (_, i) =>
        makeUser({
          id: `user-${i}`,
          created_at: new Date(`2026-02-${10 + i}T13:00:00Z`),
        }),
      );

      adRepo.find.mockResolvedValue(manyAds);
      announcementRepo.find.mockResolvedValue(manyAnnouncements);
      deathRepo.find.mockResolvedValue(manyDeaths);
      userRepo.find.mockResolvedValue(manyUsers);

      const result = await service.getRecentActivities();

      expect(result).toHaveLength(10);
    });
  });

  // ── getAdminProfile ────────────────────────────────────────────────────────

  describe('getAdminProfile', () => {
    it('admin profilini döndürmeli', async () => {
      userRepo.findOne.mockResolvedValue(
        makeUser({ id: 'admin-1', username: 'admin', role: 'admin' } as any),
      );

      const result = await service.getAdminProfile('admin-1');

      expect(result).toEqual(
        expect.objectContaining({
          id: 'admin-1',
          username: 'admin',
          role: 'admin',
        }),
      );
    });

    it('admin bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.getAdminProfile('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── updateAdminProfile ─────────────────────────────────────────────────────

  describe('updateAdminProfile', () => {
    it('username verildiğinde güncellenmeli', async () => {
      userRepo.findOne
        .mockResolvedValueOnce(
          makeUser({ id: 'admin-1', username: 'eski' } as any),
        )
        .mockResolvedValueOnce(
          makeUser({ id: 'admin-1', username: 'yeni' } as any),
        );
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateAdminProfile('admin-1', {
        username: 'yeni',
      });

      expect(userRepo.update).toHaveBeenCalledWith('admin-1', {
        username: 'yeni',
      });
      expect(result.username).toBe('yeni');
    });

    it('username verilmediğinde update çağrılmamalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ id: 'admin-1' } as any));
      userRepo.update.mockResolvedValue({ affected: 0 });

      await service.updateAdminProfile('admin-1', {});

      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it('admin bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateAdminProfile('nonexistent', { username: 'x' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── changeAdminPassword ────────────────────────────────────────────────────

  describe('changeAdminPassword', () => {
    const makePasswordQb = (user: any) => {
      const qb: any = {};
      qb.addSelect = jest.fn().mockReturnValue(qb);
      qb.where = jest.fn().mockReturnValue(qb);
      qb.getOne = jest.fn().mockResolvedValue(user);
      return qb;
    };

    it('şifre doğruysa güncellenmeli', async () => {
      const qb = makePasswordQb({ id: 'admin-1', password: 'hashed-old' });
      userRepo.createQueryBuilder.mockReturnValue(qb);
      userRepo.update.mockResolvedValue({ affected: 1 });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new');

      const result = await service.changeAdminPassword('admin-1', {
        current_password: 'eski-sifre',
        new_password: 'yeni-sifre-123',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith('eski-sifre', 'hashed-old');
      expect(userRepo.update).toHaveBeenCalledWith('admin-1', {
        password: 'hashed-new',
      });
      expect(result).toEqual({ message: 'Şifre başarıyla değiştirildi' });
    });

    it('mevcut şifre hatalıysa UnauthorizedException fırlatmalı', async () => {
      const qb = makePasswordQb({ id: 'admin-1', password: 'hashed-old' });
      userRepo.createQueryBuilder.mockReturnValue(qb);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changeAdminPassword('admin-1', {
          current_password: 'yanlis',
          new_password: 'yeni-sifre-123',
        }),
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepo.update).not.toHaveBeenCalled();
    });

    it('admin bulunamazsa NotFoundException fırlatmalı', async () => {
      const qb = makePasswordQb(null);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(
        service.changeAdminPassword('nonexistent', {
          current_password: 'x',
          new_password: 'yeni-sifre-123',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('şifre alanı null ise NotFoundException fırlatmalı', async () => {
      const qb = makePasswordQb({ id: 'admin-1', password: null });
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await expect(
        service.changeAdminPassword('admin-1', {
          current_password: 'x',
          new_password: 'yeni-sifre-123',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
