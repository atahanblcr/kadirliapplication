import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from '../database/entities/notification.entity';
import { User } from '../database/entities/user.entity';

// ─── QueryBuilder mock'ları ──────────────────────────────────────────────────

function makeSelectQb(data: any[] = []) {
  const qb: any = {};
  const chain = ['where', 'andWhere', 'orderBy', 'skip', 'take'];
  chain.forEach((m) => (qb[m] = jest.fn().mockReturnValue(qb)));
  qb.getMany = jest.fn().mockResolvedValue(data);
  return qb;
}

function makeUpdateQb() {
  const qb: any = {};
  qb.update = jest.fn().mockReturnValue(qb);
  qb.set = jest.fn().mockReturnValue(qb);
  qb.where = jest.fn().mockReturnValue(qb);
  qb.execute = jest.fn().mockResolvedValue({ affected: 1 });
  return qb;
}

// ─── Fabrika ─────────────────────────────────────────────────────────────────

const makeNotification = (overrides: Partial<Notification> = {}): Notification =>
  ({
    id: 'notif-uuid-1',
    user_id: 'user-uuid-1',
    title: 'İlanınız onaylandı',
    body: 'iPhone 13 Pro Max ilanınız yayınlandı',
    type: 'ad_approved',
    related_type: 'ad',
    related_id: 'ad-uuid-1',
    is_read: false,
    read_at: null,
    fcm_sent: false,
    created_at: new Date('2026-02-20T10:00:00Z'),
    ...overrides,
  } as Notification);

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('NotificationsService', () => {
  let service: NotificationsService;
  let notifRepo: any;
  let userRepo: any;

  beforeEach(async () => {
    const mockNotifRepo = () => ({
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    });

    const mockUserRepo = () => ({
      update: jest.fn(),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useFactory: mockNotifRepo },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    notifRepo = module.get(getRepositoryToken(Notification));
    userRepo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findAll ───────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('bildirimleri döndürmeli', async () => {
      const notifs = [makeNotification()];
      const qb = makeSelectQb(notifs);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(3);

      const result = await service.findAll('user-uuid-1', {});

      expect(result.notifications).toHaveLength(1);
    });

    it('kullanıcıya göre filtre uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(0);

      await service.findAll('user-uuid-1', {});

      expect(qb.where).toHaveBeenCalledWith(
        'n.user_id = :userId',
        { userId: 'user-uuid-1' },
      );
    });

    it('created_at DESC sıralanmalı', async () => {
      const qb = makeSelectQb([]);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(0);

      await service.findAll('user-uuid-1', {});

      expect(qb.orderBy).toHaveBeenCalledWith('n.created_at', 'DESC');
    });

    it('pagination skip/take uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(0);

      await service.findAll('user-uuid-1', { page: 2, limit: 10 });

      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(10);
    });

    it('unread_only=true olduğunda is_read filtresi uygulanmalı', async () => {
      const qb = makeSelectQb([]);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(2);

      await service.findAll('user-uuid-1', { unread_only: true });

      expect(qb.andWhere).toHaveBeenCalledWith(
        'n.is_read = :isRead',
        { isRead: false },
      );
    });

    it('unread_only=false olduğunda andWhere çağrılmamalı', async () => {
      const qb = makeSelectQb([]);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(0);

      await service.findAll('user-uuid-1', { unread_only: false });

      expect(qb.andWhere).not.toHaveBeenCalled();
    });

    it('unread_count döndürmeli', async () => {
      const qb = makeSelectQb([]);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(5);

      const result = await service.findAll('user-uuid-1', {});

      expect(result.unread_count).toBe(5);
    });

    it('boş liste döndürmeli', async () => {
      const qb = makeSelectQb([]);
      notifRepo.createQueryBuilder.mockReturnValue(qb);
      notifRepo.count.mockResolvedValue(0);

      const result = await service.findAll('user-uuid-1', {});

      expect(result.notifications).toEqual([]);
      expect(result.unread_count).toBe(0);
    });
  });

  // ── markRead ──────────────────────────────────────────────────────────────

  describe('markRead', () => {
    it('bildirimi okundu olarak işaretlemeli', async () => {
      const notif = makeNotification({ is_read: false });
      notifRepo.findOne.mockResolvedValue(notif);
      notifRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.markRead('user-uuid-1', 'notif-uuid-1');

      expect(notifRepo.update).toHaveBeenCalledWith('notif-uuid-1', {
        is_read: true,
        read_at: expect.any(Date),
      });
      expect(result).toEqual({ message: 'Okundu olarak işaretlendi' });
    });

    it('bildirim bulunamazsa NotFoundException fırlatmalı', async () => {
      notifRepo.findOne.mockResolvedValue(null);

      await expect(
        service.markRead('user-uuid-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('başka kullanıcının bildirimi bulunamazsa NotFoundException fırlatmalı', async () => {
      notifRepo.findOne.mockResolvedValue(null);

      await expect(
        service.markRead('other-user', 'notif-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('zaten okunmuşsa update çağrılmamalı', async () => {
      const notif = makeNotification({ is_read: true });
      notifRepo.findOne.mockResolvedValue(notif);

      await service.markRead('user-uuid-1', 'notif-uuid-1');

      expect(notifRepo.update).not.toHaveBeenCalled();
    });

    it('başarı mesajı döndürmeli', async () => {
      notifRepo.findOne.mockResolvedValue(makeNotification());
      notifRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.markRead('user-uuid-1', 'notif-uuid-1');

      expect(result.message).toBe('Okundu olarak işaretlendi');
    });
  });

  // ── markAllRead ───────────────────────────────────────────────────────────

  describe('markAllRead', () => {
    it('tüm bildirimleri okundu işaretlemeli', async () => {
      const qb = makeUpdateQb();
      notifRepo.createQueryBuilder.mockReturnValue(qb);

      await service.markAllRead('user-uuid-1');

      expect(qb.update).toHaveBeenCalledWith(Notification);
      expect(qb.set).toHaveBeenCalledWith({
        is_read: true,
        read_at: expect.any(Date),
      });
      expect(qb.where).toHaveBeenCalledWith(
        'user_id = :userId AND is_read = :isRead',
        { userId: 'user-uuid-1', isRead: false },
      );
      expect(qb.execute).toHaveBeenCalled();
    });

    it('başarı mesajı döndürmeli', async () => {
      const qb = makeUpdateQb();
      notifRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.markAllRead('user-uuid-1');

      expect(result).toEqual({ message: 'Tüm bildirimler okundu' });
    });
  });

  // ── registerFcmToken ──────────────────────────────────────────────────────

  describe('registerFcmToken', () => {
    it('FCM token kullanıcıya kaydedilmeli', async () => {
      userRepo.update.mockResolvedValue({ affected: 1 });

      await service.registerFcmToken('user-uuid-1', {
        fcm_token: 'fcm-token-abc123',
        device_type: 'android',
      });

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        fcm_token: 'fcm-token-abc123',
      });
    });

    it('ios device_type ile token kaydedilmeli', async () => {
      userRepo.update.mockResolvedValue({ affected: 1 });

      await service.registerFcmToken('user-uuid-1', {
        fcm_token: 'ios-fcm-token',
        device_type: 'ios',
      });

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        fcm_token: 'ios-fcm-token',
      });
    });

    it('başarı mesajı döndürmeli', async () => {
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.registerFcmToken('user-uuid-1', {
        fcm_token: 'fcm-token-abc123',
        device_type: 'android',
      });

      expect(result).toEqual({ message: 'Token kaydedildi' });
    });
  });
});
