import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
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
    'skip',
    'take',
  ];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getMany = jest.fn().mockResolvedValue(data);
  qb.getManyAndCount = jest.fn().mockResolvedValue([data, data.length]);
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

const makePharmacy = (overrides: Partial<Pharmacy> = {}): Pharmacy =>
  ({
    id: 'pharm-uuid-1',
    name: 'Merkez Eczanesi',
    address: 'Merkez Mahallesi, Ana Caddesi',
    phone: '05331234567',
    is_active: true,
    created_at: new Date('2026-02-20T08:00:00Z'),
    ...overrides,
  } as Pharmacy);

const makePharmacySchedule = (overrides: Partial<PharmacySchedule> = {}): PharmacySchedule =>
  ({
    id: 'sched-uuid-1',
    pharmacy_id: 'pharm-uuid-1',
    duty_date: '2026-03-01',
    start_time: '19:00',
    end_time: '09:00',
    ...overrides,
  } as PharmacySchedule);

const makeCemetery = (overrides: Partial<Cemetery> = {}): Cemetery =>
  ({
    id: 'cem-uuid-1',
    name: 'Merkez Mezarlığı',
    location: 'Merkez Mahallesi',
    ...overrides,
  } as Cemetery);

const makeMosque = (overrides: Partial<Mosque> = {}): Mosque =>
  ({
    id: 'mosque-uuid-1',
    name: 'Merkez Camii',
    location: 'Merkez Mahallesi',
    ...overrides,
  } as Mosque);

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
  let pharmScheduleRepo: any;
  let businessRepo: any;
  let businessCategoryRepo: any;
  let campaignImageRepo: any;
  let fileRepo: any;
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
    pharmScheduleRepo = module.get(getRepositoryToken(PharmacySchedule));
    businessRepo = module.get(getRepositoryToken(Business));
    businessCategoryRepo = module.get(getRepositoryToken(BusinessCategory));
    campaignImageRepo = module.get(getRepositoryToken(CampaignImage));
    fileRepo = module.get(getRepositoryToken(FileEntity));
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

  // ── approveAd ─────────────────────────────────────────────────────────────

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

  // ── rejectAd ──────────────────────────────────────────────────────────────

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

  // ── getUsers ──────────────────────────────────────────────────────────────

  describe('getUsers', () => {
    it('kullanıcı listesini döndürmeli', async () => {
      const qb = makeSelectQb([makeUser()]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getUsers({});

      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('deleted_at IS NULL filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({});

      expect(qb.where).toHaveBeenCalledWith('u.deleted_at IS NULL');
    });

    it('search filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({ search: 'ahmet' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(u.phone ILIKE :search OR u.username ILIKE :search)',
        { search: '%ahmet%' },
      );
    });

    it('role filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({ role: 'business' as any });

      expect(qb.andWhere).toHaveBeenCalledWith('u.role = :role', {
        role: 'business',
      });
    });

    it('is_banned filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({ is_banned: true });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'u.is_banned = :is_banned',
        { is_banned: true },
      );
    });

    it('neighborhood_id filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({ neighborhood_id: 'nbh-uuid-1' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'u.primary_neighborhood_id = :neighborhood_id',
        { neighborhood_id: 'nbh-uuid-1' },
      );
    });
  });

  // ── banUser ───────────────────────────────────────────────────────────────

  describe('banUser', () => {
    it('kullanıcı banlanmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ is_banned: false }));
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.banUser('admin-uuid', 'user-uuid-1', {
        ban_reason: 'Spam',
        duration_days: 7,
      });

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        is_banned: true,
        ban_reason: 'Spam',
        banned_at: expect.any(Date),
        banned_by: 'admin-uuid',
      });
      expect(result.message).toBe('Kullanıcı banlandı');
    });

    it('duration_days verildiğinde banned_until hesaplanmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser());
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.banUser('admin-uuid', 'user-uuid-1', {
        ban_reason: 'Spam',
        duration_days: 7,
      });

      expect(result.banned_until).toBeInstanceOf(Date);
    });

    it('duration_days verilmediğinde banned_until null olmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser());
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.banUser('admin-uuid', 'user-uuid-1', {
        ban_reason: 'Kalıcı ban',
      });

      expect(result.banned_until).toBeNull();
    });

    it('kullanıcı bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.banUser('admin-uuid', 'nonexistent', { ban_reason: 'Spam' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('zaten banlıysa BadRequestException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ is_banned: true }));

      await expect(
        service.banUser('admin-uuid', 'user-uuid-1', { ban_reason: 'Spam' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── getAdminAds ───────────────────────────────────────────────────────────

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

  // ── getAdminPharmacies ────────────────────────────────────────────────────

  describe('getAdminPharmacies', () => {
    it('eczane listesini döndürmeli', async () => {
      const pharmacies = [
        { id: 'pharm-1', name: 'Merkez Eczanesi' },
        { id: 'pharm-2', name: 'Şehir Eczanesi' },
      ];
      const qb = makeSelectQb(pharmacies);
      pharmRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAdminPharmacies();

      expect(result.pharmacies).toEqual(pharmacies);
      expect(qb.orderBy).toHaveBeenCalledWith('p.name', 'ASC');
    });

    it('search parametresi verildiğinde filtreleme yapmalı', async () => {
      const qb = makeSelectQb([]);
      pharmRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminPharmacies('Merkez');

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(p.name ILIKE :search OR p.address ILIKE :search)',
        { search: '%Merkez%' },
      );
    });
  });

  // ── unbanUser ─────────────────────────────────────────────────────────────

  describe('unbanUser', () => {
    it('kullanıcının banını kaldırmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ is_banned: true }));
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.unbanUser('admin-uuid', 'user-uuid-1');

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        is_banned: false,
        ban_reason: null,
        banned_at: null,
        banned_by: null,
      });
      expect(result.message).toBe('Ban kaldırıldı');
    });

    it('banlı olmayan kullanıcı için BadRequestException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ is_banned: false }));

      await expect(
        service.unbanUser('admin-uuid', 'user-uuid-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('kullanıcı bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.unbanUser('admin-uuid', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── changeUserRole ────────────────────────────────────────────────────────

  describe('changeUserRole', () => {
    it('kullanıcının rolünü değiştirmeli', async () => {
      userRepo.findOne.mockResolvedValue(makeUser());
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.changeUserRole('admin-uuid', 'user-uuid-1', {
        role: 'business' as any,
      });

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        role: 'business',
      });
      expect(result.message).toBe('Rol güncellendi');
      expect(result.role).toBe('business');
    });

    it('kullanıcı bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.changeUserRole('admin-uuid', 'nonexistent', { role: 'business' as any }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── getAdminCampaigns ─────────────────────────────────────────────────────

  describe('getAdminCampaigns', () => {
    it('kampanya listesini döndürmeli (mapped)', async () => {
      const campaign = makeCampaign({
        id: 'campaign-uuid-1',
        title: '%20 İndirim',
        business: { user: makeUser() } as any,
        images: [],
      });
      const qb = makeSelectQb([campaign]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAdminCampaigns({ page: 1, limit: 20 });

      expect(result.campaigns).toHaveLength(1);
      expect(result.campaigns[0].id).toBe('campaign-uuid-1');
      expect(result.campaigns[0].title).toBe('%20 İndirim');
      expect(result.meta.total).toBe(1);
    });

    it('status filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminCampaigns({ status: 'pending' });

      expect(qb.andWhere).toHaveBeenCalledWith('c.status = :status', {
        status: 'pending',
      });
    });

    it('search filtresi (title ve business name) uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminCampaigns({ search: 'Kampanya' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(c.title ILIKE :search OR business.business_name ILIKE :search)',
        { search: '%Kampanya%' },
      );
    });
  });

  // ── approveCampaign ───────────────────────────────────────────────────────

  describe('approveCampaign', () => {
    it('kampanyayı onaylamalı', async () => {
      campaignRepo.findOne.mockResolvedValue(makeCampaign({ status: 'pending' }));
      campaignRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.approveCampaign('admin-uuid', 'campaign-uuid-1');

      expect(campaignRepo.update).toHaveBeenCalledWith('campaign-uuid-1', {
        status: 'approved',
        approved_by: 'admin-uuid',
        approved_at: expect.any(Date),
      });
      expect(result.message).toBe('Kampanya onaylandı');
    });

    it('kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.approveCampaign('admin-uuid', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── rejectCampaign ────────────────────────────────────────────────────────

  describe('rejectCampaign', () => {
    it('kampanyayı reddedebilmeli (sadece reason)', async () => {
      campaignRepo.findOne.mockResolvedValue(makeCampaign({ status: 'pending' }));
      campaignRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.rejectCampaign('admin-uuid', 'campaign-uuid-1', {
        reason: 'İçerik uygunsuz',
      } as any);

      expect(campaignRepo.update).toHaveBeenCalledWith('campaign-uuid-1', {
        status: 'rejected',
        rejected_reason: 'İçerik uygunsuz',
      });
      expect(result.message).toBe('Kampanya reddedildi');
    });

    it('kampanyayı reddedebilmeli (reason + note)', async () => {
      campaignRepo.findOne.mockResolvedValue(makeCampaign({ status: 'pending' }));
      campaignRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.rejectCampaign('admin-uuid', 'campaign-uuid-1', {
        reason: 'İçerik uygunsuz',
        note: 'Düzeltip yeniden deneyin',
      } as any);

      expect(campaignRepo.update).toHaveBeenCalledWith('campaign-uuid-1', {
        status: 'rejected',
        rejected_reason: 'İçerik uygunsuz: Düzeltip yeniden deneyin',
      });
      expect(result.message).toBe('Kampanya reddedildi');
    });

    it('kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.rejectCampaign('admin-uuid', 'nonexistent', { reason: 'Test' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── deleteAdminCampaign ───────────────────────────────────────────────────

  describe('deleteAdminCampaign', () => {
    it('kampanyayı soft remove yapmalı', async () => {
      const campaign = makeCampaign();
      campaignRepo.findOne.mockResolvedValue(campaign);
      campaignRepo.softRemove.mockResolvedValue(campaign);

      const result = await service.deleteAdminCampaign('campaign-uuid-1');

      expect(campaignRepo.softRemove).toHaveBeenCalledWith(campaign);
      expect(result.message).toBe('Kampanya silindi');
    });

    it('kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteAdminCampaign('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });


  // ── getApprovals ────────────────────────────────────────────────────────

  describe('getApprovals', () => {
    it('onay bekleyen ilan listesi döndürmeli (type=ad)', async () => {
      const ad = makeAd({ status: 'pending', user: makeUser() });
      const qb = makeSelectQb([ad]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'ad' });

      expect(result.approvals).toHaveLength(1);
      expect(result.approvals[0].type).toBe('ad');
      expect(result.approvals[0].content.title).toBe(ad.title);
    });

    it('onay bekleyen vefat ilanları listesi döndürmeli (type=death)', async () => {
      const death = makeDeath({ status: 'pending', adder: makeUser() });
      const qb = makeSelectQb([death]);
      deathRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'death' });

      expect(result.approvals).toHaveLength(1);
      expect(result.approvals[0].type).toBe('death');
      expect(result.approvals[0].content.title).toBe(death.deceased_name);
    });

    it('onay bekleyen kampanyalar listesi döndürmeli (type=campaign)', async () => {
      const campaign = makeCampaign({
        status: 'pending',
        business: { user: makeUser() } as any,
      });
      const qb = makeSelectQb([campaign]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getApprovals({ type: 'campaign' });

      expect(result.approvals).toHaveLength(1);
      expect(result.approvals[0].type).toBe('campaign');
    });
  });

  // ── Pharmacy CRUD Tests (Phase 2.1a) ────────────────────────────────────

  describe('Pharmacy Operations', () => {
    // Test 1: getAdminPharmacies - boş arama
    it('getAdminPharmacies - boş arama yapıldığında tüm eczaneleri döndürmeli', async () => {
      const pharmacy = makePharmacy();
      const qb = makeSelectQb([pharmacy]);
      pharmRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAdminPharmacies();

      expect(result.pharmacies).toHaveLength(1);
      expect(result.pharmacies[0].name).toBe('Merkez Eczanesi');
    });

    // Test 2: getAdminPharmacies - arama filtresi
    it('getAdminPharmacies - arama filtresi uygulanmalı', async () => {
      const pharmacy = makePharmacy({ name: 'Akdam Eczanesi' });
      const qb = makeSelectQb([pharmacy]);
      pharmRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAdminPharmacies('Akdam');

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(p.name ILIKE :search OR p.address ILIKE :search)',
        expect.objectContaining({ search: '%Akdam%' }),
      );
      expect(result.pharmacies).toHaveLength(1);
    });

    // Test 3: createPharmacy - başarılı oluşturma
    it('createPharmacy - yeni eczane başarıyla oluşturulmalı', async () => {
      const newPharmacy = makePharmacy();
      pharmRepo.create.mockReturnValue(newPharmacy);
      pharmRepo.save.mockResolvedValue(newPharmacy);

      const result = await service.createPharmacy({
        name: 'Merkez Eczanesi',
        address: 'Merkez Mahallesi, Ana Caddesi',
        phone: '05331234567',
        is_active: true,
      });

      expect(pharmRepo.create).toHaveBeenCalledWith({
        name: 'Merkez Eczanesi',
        address: 'Merkez Mahallesi, Ana Caddesi',
        phone: '05331234567',
        is_active: true,
      });
      expect(pharmRepo.save).toHaveBeenCalledWith(newPharmacy);
      expect(result.pharmacy).toEqual(newPharmacy);
    });

    // Test 4: createPharmacy - dönüş formatı
    it('createPharmacy - doğru formatta dönüş yapmalı', async () => {
      const newPharmacy = makePharmacy({
        name: 'Test Eczanesi',
        phone: '05331234567',
      });
      pharmRepo.create.mockReturnValue(newPharmacy);
      pharmRepo.save.mockResolvedValue(newPharmacy);

      const result = await service.createPharmacy({
        name: 'Test Eczanesi',
        address: 'Test Adresi',
        phone: '05331234567',
        is_active: true,
      });

      expect(result).toHaveProperty('pharmacy');
      expect(result.pharmacy.name).toBe('Test Eczanesi');
    });

    // Test 5: updatePharmacy - başarılı güncelleme
    it('updatePharmacy - eczane başarıyla güncellenebilmeli', async () => {
      const existingPharmacy = makePharmacy();
      pharmRepo.findOne.mockResolvedValue(existingPharmacy);
      pharmRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updatePharmacy('pharm-uuid-1', {
        name: 'Güncellenmiş Eczanesi',
        phone: '05339876543',
      });

      expect(pharmRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'pharm-uuid-1' },
      });
      expect(pharmRepo.update).toHaveBeenCalledWith('pharm-uuid-1', {
        name: 'Güncellenmiş Eczanesi',
        phone: '05339876543',
      });
      expect(result.pharmacy.name).toBe('Güncellenmiş Eczanesi');
    });

    // Test 6: updatePharmacy - eczane bulunamadı
    it('updatePharmacy - eczane bulunamazsa NotFoundException fırlatmalı', async () => {
      pharmRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updatePharmacy('nonexistent', { name: 'Yeni İsim' }),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 7: deletePharmacy - başarılı silme
    it('deletePharmacy - eczane başarıyla silinebilmeli', async () => {
      const existingPharmacy = makePharmacy();
      pharmRepo.findOne.mockResolvedValue(existingPharmacy);
      pharmRepo.remove.mockResolvedValue(existingPharmacy);

      const result = await service.deletePharmacy('pharm-uuid-1');

      expect(pharmRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'pharm-uuid-1' },
      });
      expect(pharmRepo.remove).toHaveBeenCalledWith(existingPharmacy);
      expect(result.message).toBe('Eczane silindi');
    });

    // Test 8: deletePharmacy - eczane bulunamadı
    it('deletePharmacy - eczane bulunamazsa NotFoundException fırlatmalı', async () => {
      pharmRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deletePharmacy('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Ad Operations (Phase 2.1b) ──────────────────────────────────────────

  describe('Ad Operations', () => {
    // Test 1: getAdminAds - tüm ilanlar
    it('getAdminAds - tüm uygun ilanları döndürmeli', async () => {
      const ad1 = makeAd({ id: 'ad-1', title: 'iPhone' });
      const ad2 = makeAd({ id: 'ad-2', title: 'Samsung' });
      const qb = makeSelectQb([ad1, ad2]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAdminAds({ page: 1, limit: 20 });

      expect(result.ads).toHaveLength(2);
      expect(result.ads[0].title).toBe('iPhone');
      expect(result.meta.total).toBe(2);
    });

    // Test 2: getAdminAds - status filtresi
    it('getAdminAds - status filtresi uygulanmalı', async () => {
      const pendingAd = makeAd({ status: 'pending' });
      const qb = makeSelectQb([pendingAd]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminAds({ status: 'pending' });

      expect(qb.andWhere).toHaveBeenCalledWith('ad.status = :status', {
        status: 'pending',
      });
    });

    // Test 3: getAdminAds - arama filtresi
    it('getAdminAds - arama filtresi uygulanmalı', async () => {
      const ad = makeAd({ title: 'Samsung Galaxy' });
      const qb = makeSelectQb([ad]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminAds({ search: 'Samsung' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(ad.title ILIKE :search OR ad.description ILIKE :search)',
        expect.objectContaining({ search: '%Samsung%' }),
      );
    });

    // Test 4: getAdminAds - pagination
    it('getAdminAds - pagination doğru hesaplanmalı', async () => {
      const qb = makeSelectQb([makeAd()]);
      adRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminAds({ page: 2, limit: 10 });

      // page 2, limit 10 => skip(10)
      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(10);
    });

    // Test 5: approveAd - başarılı onay
    it('approveAd - pending ilan başarıyla onaylanmalı', async () => {
      const pendingAd = makeAd({ status: 'pending', user_id: 'user-1' });
      adRepo.findOne.mockResolvedValue(pendingAd);
      adRepo.update.mockResolvedValue({ affected: 1 });
      notifRepo.create.mockReturnValue({ id: 'notif-1' });
      notifRepo.save.mockResolvedValue({ id: 'notif-1' });

      const result = await service.approveAd('admin-uuid', 'ad-uuid-1');

      expect(adRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'ad-uuid-1', status: 'pending' },
      });
      expect(adRepo.update).toHaveBeenCalledWith('ad-uuid-1', {
        status: 'approved',
        approved_by: 'admin-uuid',
        approved_at: expect.any(Date),
      });
      expect(result.message).toBe('İlan onaylandı');
    });

    // Test 6: approveAd - bildirim
    it('approveAd - bildirim oluşturulmalı', async () => {
      const ad = makeAd({ status: 'pending', user_id: 'user-1', title: 'Test İlan' });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.update.mockResolvedValue({ affected: 1 });
      notifRepo.create.mockReturnValue({});
      notifRepo.save.mockResolvedValue({});

      await service.approveAd('admin-uuid', 'ad-uuid-1');

      expect(notifRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          type: 'ad_approved',
          related_type: 'ad',
        }),
      );
    });

    // Test 7: approveAd - ilan bulunamadı
    it('approveAd - pending olmayan ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(
        service.approveAd('admin-uuid', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 8: rejectAd - başarılı ret
    it('rejectAd - pending ilan başarıyla reddedilebilmeli', async () => {
      const pendingAd = makeAd({ status: 'pending', user_id: 'user-1' });
      adRepo.findOne.mockResolvedValue(pendingAd);
      adRepo.update.mockResolvedValue({ affected: 1 });
      notifRepo.create.mockReturnValue({});
      notifRepo.save.mockResolvedValue({});

      const result = await service.rejectAd('admin-uuid', 'ad-uuid-1', {
        rejected_reason: 'Hatalı bilgiler',
      });

      expect(adRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'ad-uuid-1', status: 'pending' },
      });
      expect(adRepo.update).toHaveBeenCalledWith('ad-uuid-1', {
        status: 'rejected',
        rejected_reason: 'Hatalı bilgiler',
        rejected_at: expect.any(Date),
      });
      expect(result.message).toBe('İlan reddedildi');
    });

    // Test 9: rejectAd - red bildirimi
    it('rejectAd - red bildirimi oluşturulmalı', async () => {
      const ad = makeAd({ status: 'pending', user_id: 'user-1', title: 'Test' });
      adRepo.findOne.mockResolvedValue(ad);
      adRepo.update.mockResolvedValue({ affected: 1 });
      notifRepo.create.mockReturnValue({});
      notifRepo.save.mockResolvedValue({});

      await service.rejectAd('admin-uuid', 'ad-uuid-1', {
        rejected_reason: 'Uygunsuz',
      });

      expect(notifRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          type: 'ad_rejected',
          related_type: 'ad',
        }),
      );
    });

    // Test 10: rejectAd - ilan bulunamadı
    it('rejectAd - pending olmayan ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      adRepo.findOne.mockResolvedValue(null);

      await expect(
        service.rejectAd('admin-uuid', 'nonexistent', {
          rejected_reason: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Campaign Operations (Phase 2.1c) ────────────────────────────────────

  describe('Campaign Operations', () => {
    // Test 1: getAdminCampaigns - listele
    it('getAdminCampaigns - kampanjaları sayfalı döndürmeli', async () => {
      const camp1 = makeCampaign({ id: 'camp-1', title: 'Yaz İndirimi' });
      const camp2 = makeCampaign({ id: 'camp-2', title: 'Kış İndirimi' });
      const qb = makeSelectQb([camp1, camp2]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAdminCampaigns({ page: 1, limit: 20 });

      expect(result.campaigns).toHaveLength(2);
      expect(result.campaigns[0].title).toBe('Yaz İndirimi');
      expect(result.meta.total).toBe(2);
    });

    // Test 2: getAdminCampaigns - status filtresi
    it('getAdminCampaigns - status filtresine göre kampanyaları döndürmeli', async () => {
      const pendingCamp = makeCampaign({ status: 'pending' });
      const qb = makeSelectQb([pendingCamp]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminCampaigns({ status: 'pending' });

      expect(qb.andWhere).toHaveBeenCalledWith('c.status = :status', {
        status: 'pending',
      });
    });

    // Test 3: getAdminCampaigns - arama filtresi
    it('getAdminCampaigns - arama filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([makeCampaign()]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminCampaigns({ search: 'Test' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        '(c.title ILIKE :search OR business.business_name ILIKE :search)',
        expect.objectContaining({ search: '%Test%' }),
      );
    });

    // Test 4: getAdminCampaigns - pagination
    it('getAdminCampaigns - pagination doğru hesaplanmalı', async () => {
      const qb = makeSelectQb([makeCampaign()]);
      campaignRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAdminCampaigns({ page: 3, limit: 10 });

      // page 3, limit 10 => skip(20)
      expect(qb.skip).toHaveBeenCalledWith(20);
      expect(qb.take).toHaveBeenCalledWith(10);
    });

    // Test 5: approveCampaign - başarılı onay
    it('approveCampaign - pending kampanya başarıyla onaylanmalı', async () => {
      const pendingCamp = makeCampaign({ status: 'pending' });
      campaignRepo.findOne.mockResolvedValue(pendingCamp);
      campaignRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.approveCampaign('admin-1', 'camp-uuid');

      expect(campaignRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'camp-uuid', status: 'pending' },
      });
      expect(campaignRepo.update).toHaveBeenCalledWith('camp-uuid', {
        status: 'approved',
        approved_by: 'admin-1',
        approved_at: expect.any(Date),
      });
      expect(result.message).toBe('Kampanya onaylandı');
    });

    // Test 6: approveCampaign - ilan bulunamadı
    it('approveCampaign - pending olmayan kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.approveCampaign('admin-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 7: rejectCampaign - başarılı ret
    it('rejectCampaign - pending kampanya başarıyla reddedilebilmeli', async () => {
      const pendingCamp = makeCampaign({ status: 'pending' });
      campaignRepo.findOne.mockResolvedValue(pendingCamp);
      campaignRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.rejectCampaign('admin-1', 'camp-uuid', {
        reason: 'Hatalı bilgiler',
      });

      expect(campaignRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'camp-uuid', status: 'pending' },
      });
      expect(campaignRepo.update).toHaveBeenCalledWith('camp-uuid', {
        status: 'rejected',
        rejected_reason: 'Hatalı bilgiler',
      });
      expect(result.message).toBe('Kampanya reddedildi');
    });

    // Test 8: rejectCampaign - reason + note ile
    it('rejectCampaign - reason ve note concatenation yapmalı', async () => {
      const pendingCamp = makeCampaign({ status: 'pending' });
      campaignRepo.findOne.mockResolvedValue(pendingCamp);
      campaignRepo.update.mockResolvedValue({ affected: 1 });

      await service.rejectCampaign('admin-1', 'camp-uuid', {
        reason: 'Hatalı bilgiler',
        note: 'Referans eksik',
      });

      expect(campaignRepo.update).toHaveBeenCalledWith('camp-uuid', {
        status: 'rejected',
        rejected_reason: 'Hatalı bilgiler: Referans eksik',
      });
    });

    // Test 9: rejectCampaign - kampanya bulunamadı
    it('rejectCampaign - pending olmayan kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.rejectCampaign('admin-1', 'nonexistent', {
          reason: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 10: deleteAdminCampaign - başarılı silme
    it('deleteAdminCampaign - kampanya başarıyla silinebilmeli', async () => {
      const camp = makeCampaign({ id: 'camp-uuid' });
      campaignRepo.findOne.mockResolvedValue(camp);
      campaignRepo.softRemove.mockResolvedValue(camp);

      const result = await service.deleteAdminCampaign('camp-uuid');

      expect(campaignRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'camp-uuid' },
      });
      expect(campaignRepo.softRemove).toHaveBeenCalledWith(camp);
      expect(result.message).toBe('Kampanya silindi');
    });

    // Test 11: deleteAdminCampaign - kampanya bulunamadı
    it('deleteAdminCampaign - kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteAdminCampaign('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Business & Category Operations ──────────────────────────────────────

  describe('Business Operations', () => {
    // Test 1: getAdminBusinesses
    it('getAdminBusinesses - işletmeleri döndürmeli', async () => {
      const businesses = [
        { id: 'biz-1', business_name: 'Ahmet Market' },
        { id: 'biz-2', business_name: 'Ayşe Dükkanı' },
      ];
      businessRepo.find.mockResolvedValue(businesses);

      const result = await service.getAdminBusinesses();

      expect(result.businesses).toHaveLength(2);
      expect(result.businesses[0].business_name).toBe('Ahmet Market');
    });

    // Test 2: getBusinessCategories
    it('getBusinessCategories - aktif kategorileri döndürmeli', async () => {
      const categories = [
        { id: 'cat-1', name: 'Gıda' },
        { id: 'cat-2', name: 'Elektrik' },
      ];
      businessCategoryRepo.find.mockResolvedValue(categories);

      const result = await service.getBusinessCategories();

      expect(result.categories).toHaveLength(2);
      expect(result.categories[0].name).toBe('Gıda');
      expect(businessCategoryRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { is_active: true },
        }),
      );
    });

    // Test 3: createAdminCampaign - işletme bulunamadı
    it('createAdminCampaign - işletme bulunamazsa NotFoundException fırlatmalı', async () => {
      businessRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createAdminCampaign('admin-1', {
          business_id: 'nonexistent',
          title: 'Test',
          description: 'Test',
          discount_rate: 20,
          valid_from: '2026-03-01',
          valid_until: '2026-03-31',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 4: updateAdminCampaign - kampanya bulunamadı
    it('updateAdminCampaign - kampanya bulunamazsa NotFoundException fırlatmalı', async () => {
      campaignRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateAdminCampaign('nonexistent', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 5: updateAdminCampaign - işletme bulunamadı
    it('updateAdminCampaign - işletme bulunamadığında NotFoundException fırlatmalı', async () => {
      const campaign = makeCampaign({ id: 'camp-1' });
      campaignRepo.findOne.mockResolvedValue(campaign);
      businessRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateAdminCampaign('camp-1', {
          business_id: 'nonexistent',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── Deaths Admin Operations (Phase 2.2) ─────────────────────────────────

  describe('Deaths Admin Operations', () => {
    // Test 1: getAllDeaths - listele
    it('getAllDeaths - vefat ilanlarını sayfalı döndürmeli', async () => {
      const death1 = makeDeath({ id: 'death-1', deceased_name: 'Ahmet' });
      const death2 = makeDeath({ id: 'death-2', deceased_name: 'Fatma' });
      const qb = makeSelectQb([death1, death2]);
      deathRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getAllDeaths({ page: 1, limit: 20 });

      expect(result.notices).toHaveLength(2);
      expect(result.notices[0].deceased_name).toBe('Ahmet');
      expect(result.meta.total).toBe(2);
    });

    // Test 2: getAllDeaths - arama filtresi
    it('getAllDeaths - arama filtresine göre vefat ilanlarını döndürmeli', async () => {
      const death = makeDeath({ deceased_name: 'Mehmet Kaya' });
      const qb = makeSelectQb([death]);
      deathRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAllDeaths({ search: 'Mehmet' });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'LOWER(d.deceased_name) LIKE :search',
        expect.objectContaining({ search: '%mehmet%' }),
      );
    });

    // Test 3: getAllDeaths - pagination
    it('getAllDeaths - pagination doğru hesaplanmalı', async () => {
      const qb = makeSelectQb([makeDeath()]);
      deathRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getAllDeaths({ page: 2, limit: 10 });

      // page 2, limit 10 => skip(10)
      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(10);
    });

    // Test 4: createDeath - başarılı oluşturma
    it('createDeath - vefat ilanı başarıyla oluşturulmalı', async () => {
      const newDeath = makeDeath({ id: 'new-death' });
      deathRepo.create.mockReturnValue(newDeath);
      deathRepo.save.mockResolvedValue(newDeath);
      deathRepo.findOne.mockResolvedValue(newDeath);

      const result = await service.createDeath('admin-1', {
        deceased_name: 'Test Kişi',
        age: 70,
        funeral_date: '2026-02-28',
        funeral_time: '14:00',
        cemetery_id: 'cem-1',
        mosque_id: 'mosque-1',
        neighborhood_id: 'neigh-1',
        condolence_address: 'Test Adresi',
      });

      expect(deathRepo.create).toHaveBeenCalled();
      expect(deathRepo.save).toHaveBeenCalled();
      expect(result.notice).toBeDefined();
    });

    // Test 5: createDeath - auto_archive_at hesaplanmalı
    it('createDeath - auto_archive_at (funeral_date + 7 gün) hesaplanmalı', async () => {
      const newDeath = makeDeath({ id: 'new-death' });
      deathRepo.create.mockReturnValue(newDeath);
      deathRepo.save.mockResolvedValue(newDeath);
      deathRepo.findOne.mockResolvedValue(newDeath);

      await service.createDeath('admin-1', {
        deceased_name: 'Test',
        age: 70,
        funeral_date: '2026-02-28',
        funeral_time: '14:00',
        cemetery_id: 'cem-1',
        mosque_id: 'mosque-1',
        neighborhood_id: 'neigh-1',
        condolence_address: 'Test',
      });

      const createCall = deathRepo.create.mock.calls[0][0];
      // Kontrol et: auto_archive_at = funeral_date + 7 gün
      expect(createCall.auto_archive_at).toBeDefined();
      expect(createCall.status).toBe('approved');
      expect(createCall.added_by).toBe('admin-1');
    });

    // Test 6: updateDeath - başarılı güncelleme
    it('updateDeath - vefat ilanı başarıyla güncellenebilmeli', async () => {
      const existingDeath = makeDeath({ id: 'death-1' });
      deathRepo.findOne.mockResolvedValue(existingDeath);
      deathRepo.save.mockResolvedValue(existingDeath);

      const result = await service.updateDeath('admin-1', 'death-1', {
        deceased_name: 'Güncellenmiş İsim',
        age: 75,
      });

      expect(deathRepo.findOne).toHaveBeenCalledWith({ where: { id: 'death-1' } });
      expect(deathRepo.save).toHaveBeenCalled();
      expect(result.notice).toBeDefined();
    });

    // Test 7: updateDeath - funeral_date değişirse auto_archive_at yeniden hesaplanmalı
    it('updateDeath - funeral_date güncellenirse auto_archive_at yeniden hesaplanmalı', async () => {
      const death = makeDeath({ id: 'death-1' });
      deathRepo.findOne.mockResolvedValue(death);
      deathRepo.save.mockResolvedValue(death);

      await service.updateDeath('admin-1', 'death-1', {
        funeral_date: '2026-03-10',
      });

      const saveCall = deathRepo.save.mock.calls[0][0];
      // Kontrol et: auto_archive_at = new funeral_date + 7 gün
      expect(saveCall.funeral_date).toBe('2026-03-10');
      expect(saveCall.auto_archive_at).toBeDefined();
    });

    // Test 8: updateDeath - ilan bulunamadı
    it('updateDeath - ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      deathRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateDeath('admin-1', 'nonexistent', {
          deceased_name: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 9: deleteDeath - başarılı silme
    it('deleteDeath - vefat ilanı başarıyla silinebilmeli', async () => {
      const death = makeDeath({ id: 'death-1' });
      deathRepo.findOne.mockResolvedValue(death);
      deathRepo.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteDeath('death-1');

      expect(deathRepo.findOne).toHaveBeenCalledWith({ where: { id: 'death-1' } });
      expect(deathRepo.softDelete).toHaveBeenCalledWith('death-1');
      expect(result.success).toBe(true);
    });

    // Test 10: deleteDeath - ilan bulunamadı
    it('deleteDeath - ilan bulunamazsa NotFoundException fırlatmalı', async () => {
      deathRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteDeath('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 11: getCemeteries - listele
    it('getCemeteries - mezarlıkları döndürmeli', async () => {
      const cem1 = makeCemetery({ id: 'cem-1', name: 'Merkez Mezarlığı' });
      const cem2 = makeCemetery({ id: 'cem-2', name: 'Akdam Mezarlığı' });
      cemeteryRepo.find.mockResolvedValue([cem1, cem2]);

      const result = await service.getCemeteries();

      expect(result.cemeteries).toHaveLength(2);
      expect(result.cemeteries[0].name).toBe('Merkez Mezarlığı');
    });

    // Test 12: createCemetery - başarılı oluşturma
    it('createCemetery - mezarlık başarıyla oluşturulmalı', async () => {
      const newCem = makeCemetery();
      cemeteryRepo.create.mockReturnValue(newCem);
      cemeteryRepo.save.mockResolvedValue(newCem);

      const result = await service.createCemetery({
        name: 'Yeni Mezarlık',
        location: 'Test Mahallesi',
      });

      expect(cemeteryRepo.create).toHaveBeenCalled();
      expect(cemeteryRepo.save).toHaveBeenCalled();
      expect(result.cemetery).toBeDefined();
    });

    // Test 13: updateCemetery - başarılı güncelleme
    it('updateCemetery - mezarlık başarıyla güncellenebilmeli', async () => {
      const cem = makeCemetery({ id: 'cem-1' });
      cemeteryRepo.findOne.mockResolvedValue(cem);
      cemeteryRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateCemetery('cem-1', {
        name: 'Güncellenmiş İsim',
      });

      expect(cemeteryRepo.findOne).toHaveBeenCalledWith({ where: { id: 'cem-1' } });
      expect(cemeteryRepo.update).toHaveBeenCalledWith('cem-1', { name: 'Güncellenmiş İsim' });
    });

    // Test 14: updateCemetery - mezarlık bulunamadı
    it('updateCemetery - mezarlık bulunamazsa NotFoundException fırlatmalı', async () => {
      cemeteryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateCemetery('nonexistent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 15: deleteCemetery - başarılı silme
    it('deleteCemetery - mezarlık başarıyla silinebilmeli', async () => {
      const cem = makeCemetery({ id: 'cem-1' });
      cemeteryRepo.findOne.mockResolvedValue(cem);
      cemeteryRepo.remove.mockResolvedValue(cem);

      const result = await service.deleteCemetery('cem-1');

      expect(cemeteryRepo.findOne).toHaveBeenCalledWith({ where: { id: 'cem-1' } });
      expect(cemeteryRepo.remove).toHaveBeenCalledWith(cem);
      expect(result.message).toBe('Mezarlık silindi');
    });

    // Test 16: deleteCemetery - mezarlık bulunamadı
    it('deleteCemetery - mezarlık bulunamazsa NotFoundException fırlatmalı', async () => {
      cemeteryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteCemetery('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 17: getMosques - listele
    it('getMosques - camileri döndürmeli', async () => {
      const m1 = makeMosque({ id: 'mosque-1', name: 'Merkez Camii' });
      const m2 = makeMosque({ id: 'mosque-2', name: 'Akdam Camii' });
      mosqueRepo.find.mockResolvedValue([m1, m2]);

      const result = await service.getMosques();

      expect(result.mosques).toHaveLength(2);
      expect(result.mosques[0].name).toBe('Merkez Camii');
    });

    // Test 18: createMosque - başarılı oluşturma
    it('createMosque - cami başarıyla oluşturulmalı', async () => {
      const newMosque = makeMosque();
      mosqueRepo.create.mockReturnValue(newMosque);
      mosqueRepo.save.mockResolvedValue(newMosque);

      const result = await service.createMosque({
        name: 'Yeni Camii',
        location: 'Test Mahallesi',
      });

      expect(mosqueRepo.create).toHaveBeenCalled();
      expect(mosqueRepo.save).toHaveBeenCalled();
      expect(result.mosque).toBeDefined();
    });

    // Test 19: updateMosque - başarılı güncelleme
    it('updateMosque - cami başarıyla güncellenebilmeli', async () => {
      const mosque = makeMosque({ id: 'mosque-1' });
      mosqueRepo.findOne.mockResolvedValue(mosque);
      mosqueRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateMosque('mosque-1', {
        name: 'Güncellenmiş Camii',
      });

      expect(mosqueRepo.findOne).toHaveBeenCalledWith({ where: { id: 'mosque-1' } });
      expect(mosqueRepo.update).toHaveBeenCalledWith('mosque-1', { name: 'Güncellenmiş Camii' });
    });

    // Test 20: updateMosque - cami bulunamadı
    it('updateMosque - cami bulunamazsa NotFoundException fırlatmalı', async () => {
      mosqueRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateMosque('nonexistent', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 21: deleteMosque - başarılı silme
    it('deleteMosque - cami başarıyla silinebilmeli', async () => {
      const mosque = makeMosque({ id: 'mosque-1' });
      mosqueRepo.findOne.mockResolvedValue(mosque);
      mosqueRepo.remove.mockResolvedValue(mosque);

      const result = await service.deleteMosque('mosque-1');

      expect(mosqueRepo.findOne).toHaveBeenCalledWith({ where: { id: 'mosque-1' } });
      expect(mosqueRepo.remove).toHaveBeenCalledWith(mosque);
      expect(result.message).toBe('Cami silindi');
    });

    // Test 22: deleteMosque - cami bulunamadı
    it('deleteMosque - cami bulunamazsa NotFoundException fırlatmalı', async () => {
      mosqueRepo.findOne.mockResolvedValue(null);

      await expect(
        service.deleteMosque('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    // Test 23: getDeathNeighborhoods - listele
    it('getDeathNeighborhoods - aktif mahalleleri döndürmeli', async () => {
      const neigh1 = { id: 'n-1', name: 'Merkez', is_active: true };
      const neigh2 = { id: 'n-2', name: 'Akdam', is_active: true };
      neighborhoodRepo.find.mockResolvedValue([neigh1, neigh2]);

      const result = await service.getDeathNeighborhoods();

      expect(result.neighborhoods).toHaveLength(2);
      expect(neighborhoodRepo.find).toHaveBeenCalledWith({
        where: { is_active: true },
        order: expect.any(Object),
      });
    });
  });
});
