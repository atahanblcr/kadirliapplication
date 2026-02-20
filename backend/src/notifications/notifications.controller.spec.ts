import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: jest.Mocked<NotificationsService>;

  beforeEach(async () => {
    const mockService = {
      findAll: jest.fn(),
      markRead: jest.fn(),
      markAllRead: jest.fn(),
      registerFcmToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [{ provide: NotificationsService, useValue: mockService }],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get(NotificationsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /notifications ────────────────────────────────────────────────────

  describe('findAll', () => {
    it('bildirimleri döndürmeli', async () => {
      const expected = {
        notifications: [
          {
            id: 'notif-uuid-1',
            title: 'İlanınız onaylandı',
            is_read: false,
          },
        ],
        unread_count: 1,
      };
      service.findAll.mockResolvedValue(expected);

      const result = await controller.findAll('user-uuid-1', {});

      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalledWith('user-uuid-1', {});
    });

    it('filtreleri service\'e iletmeli', async () => {
      service.findAll.mockResolvedValue({ notifications: [], unread_count: 0 });
      const dto = { page: 2, limit: 10, unread_only: true };

      await controller.findAll('user-uuid-1', dto);

      expect(service.findAll).toHaveBeenCalledWith('user-uuid-1', dto);
    });

    it('boş liste döndürmeli', async () => {
      service.findAll.mockResolvedValue({ notifications: [], unread_count: 0 });

      const result = await controller.findAll('user-uuid-1', {});

      expect(result.notifications).toEqual([]);
    });
  });

  // ── POST /notifications/read-all ──────────────────────────────────────────

  describe('markAllRead', () => {
    it('tüm bildirimleri okundu işaretlemeli', async () => {
      service.markAllRead.mockResolvedValue({ message: 'Tüm bildirimler okundu' });

      const result = await controller.markAllRead('user-uuid-1');

      expect(result).toEqual({ message: 'Tüm bildirimler okundu' });
      expect(service.markAllRead).toHaveBeenCalledWith('user-uuid-1');
    });
  });

  // ── POST /notifications/fcm-token ─────────────────────────────────────────

  describe('registerFcmToken', () => {
    it('FCM token kaydetmeli', async () => {
      service.registerFcmToken.mockResolvedValue({ message: 'Token kaydedildi' });
      const dto = { fcm_token: 'fcm-abc123', device_type: 'android' as const };

      const result = await controller.registerFcmToken('user-uuid-1', dto);

      expect(result).toEqual({ message: 'Token kaydedildi' });
      expect(service.registerFcmToken).toHaveBeenCalledWith('user-uuid-1', dto);
    });

    it('service hatası yayılmalı', async () => {
      service.registerFcmToken.mockRejectedValue(new Error('DB hatası'));

      await expect(
        controller.registerFcmToken('user-uuid-1', {
          fcm_token: 'token',
          device_type: 'ios',
        }),
      ).rejects.toThrow('DB hatası');
    });
  });

  // ── PATCH /notifications/:id/read ─────────────────────────────────────────

  describe('markRead', () => {
    it('bildirimi okundu işaretlemeli', async () => {
      service.markRead.mockResolvedValue({ message: 'Okundu olarak işaretlendi' });

      const result = await controller.markRead('user-uuid-1', 'notif-uuid-1');

      expect(result).toEqual({ message: 'Okundu olarak işaretlendi' });
      expect(service.markRead).toHaveBeenCalledWith(
        'user-uuid-1',
        'notif-uuid-1',
      );
    });

    it('service hatası yayılmalı', async () => {
      service.markRead.mockRejectedValue(new Error('Bildirim bulunamadı'));

      await expect(
        controller.markRead('user-uuid-1', 'nonexistent'),
      ).rejects.toThrow('Bildirim bulunamadı');
    });
  });
});
