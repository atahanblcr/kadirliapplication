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

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('AdminService - Users Operations', () => {
  let service: AdminService;
  let userRepo: any;

  beforeEach(async () => {
    const mockRepo = () => ({
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    });

    const testingModule: TestingModule = await Test.createTestingModule({
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

    service = testingModule.get<AdminService>(AdminService);
    userRepo = testingModule.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  // ── getUsers ──────────────────────────────────────────────────────────────

  describe('getUsers', () => {
    it('QueryBuilder oluşturmalı', async () => {
      const qb = makeSelectQb([makeUser()]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({
        page: 1,
        limit: 50,
        search: '',
      });

      expect(userRepo.createQueryBuilder).toHaveBeenCalled();
      expect(qb.getManyAndCount).toHaveBeenCalled();
    });

    it('search filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([makeUser({ username: 'john' })]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({
        page: 1,
        limit: 50,
        search: 'john',
      });

      expect(qb.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('username'),
        expect.any(Object),
      );
    });

    it('role filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({
        page: 1,
        limit: 50,
        search: '',
        role: 'ADMIN',
      });

      expect(qb.andWhere).toHaveBeenCalled();
    });

    it('is_banned filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      userRepo.createQueryBuilder.mockReturnValue(qb);

      await service.getUsers({
        page: 1,
        limit: 50,
        search: '',
        is_banned: true,
      });

      expect(qb.andWhere).toHaveBeenCalled();
    });
  });

  // ── getUser (by ID) ───────────────────────────────────────────────────────

  describe('getUser', () => {
    it('findOne çağrılmalı', async () => {
      const user = makeUser({ id: 'user-123' });
      userRepo.findOne.mockResolvedValue(user);

      await service.getUser('user-123');

      expect(userRepo.findOne).toHaveBeenCalled();
    });

    it('bulunamayan kullanıcı NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.getUser('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── unbanUser ─────────────────────────────────────────────────────────────

  describe('unbanUser', () => {
    it('update çağrılmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ is_banned: true }));
      userRepo.update.mockResolvedValue({ affected: 1 });

      await service.unbanUser('admin-uuid', 'user-uuid-1');

      expect(userRepo.update).toHaveBeenCalled();
    });

    it('banı olmayan kullanıcıyı unbanlarsak BadRequest fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ is_banned: false }));

      await expect(
        service.unbanUser('admin-uuid', 'user-uuid-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('bulunamayan kullanıcıyı unbanlarsak NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.unbanUser('admin-uuid', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── changeUserRole ────────────────────────────────────────────────────────

  describe('changeUserRole', () => {
    it('kullanıcı rolünü değiştirmeli', async () => {
      userRepo.findOne.mockResolvedValue(makeUser());
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.changeUserRole('admin-uuid', 'user-uuid-1', {
        role: 'MODERATOR',
      });

      expect(userRepo.update).toHaveBeenCalledWith(
        'user-uuid-1',
        expect.objectContaining({ role: 'MODERATOR' }),
      );
    });

    it('bulunamayan kullanıcının rolünü değiştirirse NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.changeUserRole('admin-uuid', 'nonexistent', { role: 'ADMIN' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── banUser ───────────────────────────────────────────────────────────────

  describe('banUser', () => {
    it('kullanıcıyı banlamalı', async () => {
      userRepo.findOne.mockResolvedValue(makeUser({ is_banned: false }));
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.banUser('admin-uuid', 'user-uuid-1', {
        ban_reason: 'Spam',
      });

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        is_banned: true,
        ban_reason: 'Spam',
        banned_at: expect.any(Date),
        banned_by: 'admin-uuid',
      });
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
});
