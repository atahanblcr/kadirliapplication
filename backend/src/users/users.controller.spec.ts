import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UserRole } from '../common/enums/user-role.enum';

// ─── Yardımcı fabrika fonksiyonu ─────────────────────────────────────────────

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-uuid-1',
    phone: '05551234567',
    username: 'ahmet123',
    age: 25,
    role: UserRole.USER,
    primary_neighborhood_id: 'nb-uuid-1',
    primary_neighborhood: { id: 'nb-uuid-1', name: 'Merkez', slug: 'merkez' } as any,
    location_type: 'neighborhood',
    notification_preferences: {
      announcements: true,
      deaths: true,
      pharmacy: true,
      events: true,
      ads: false,
      campaigns: false,
    },
    fcm_token: null,
    profile_photo_url: null,
    is_active: true,
    is_banned: false,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
    ...overrides,
  } as User);

// ─── Test suite ───────────────────────────────────────────────────────────────

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            updateProfile: jest.fn(),
            updateNotificationPreferences: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── GET /users/me ─────────────────────────────────────────────────────────

  describe('GET /users/me', () => {
    it('JWT\'den gelen kullanıcıyı döndürmeli', async () => {
      const user = makeUser();

      const result = await controller.getMe(user);

      expect(result).toEqual({ user });
    });

    it('service çağırmadan sadece JWT user\'ını döndürmeli', async () => {
      const user = makeUser();

      await controller.getMe(user);

      // getMe doğrudan user'ı döndürüyor, service çağrılmamalı
      expect(usersService.updateProfile).not.toHaveBeenCalled();
    });
  });

  // ── PATCH /users/me ───────────────────────────────────────────────────────

  describe('PATCH /users/me', () => {
    it('profili güncelleyip güncel kullanıcıyı döndürmeli', async () => {
      const user = makeUser();
      const updatedUser = makeUser({ username: 'yeni_isim', age: 30 });
      usersService.updateProfile.mockResolvedValue(updatedUser);

      const dto: UpdateUserDto = { username: 'yeni_isim', age: 30 };
      const result = await controller.updateProfile(user, dto);

      expect(usersService.updateProfile).toHaveBeenCalledWith(user.id, dto);
      expect(result).toEqual({ user: updatedUser });
    });

    it('service hatasını yukarı iletmeli', async () => {
      const user = makeUser();
      usersService.updateProfile.mockRejectedValue(new Error('Service hatası'));

      const dto: UpdateUserDto = { username: 'x' };
      await expect(controller.updateProfile(user, dto)).rejects.toThrow('Service hatası');
    });

    it('boş DTO ile çağrılabilmeli', async () => {
      const user = makeUser();
      usersService.updateProfile.mockResolvedValue(user);

      const result = await controller.updateProfile(user, {});

      expect(usersService.updateProfile).toHaveBeenCalledWith(user.id, {});
      expect(result).toEqual({ user });
    });
  });

  // ── PATCH /users/me/notifications ────────────────────────────────────────

  describe('PATCH /users/me/notifications', () => {
    it('bildirim tercihlerini güncelleyip döndürmeli', async () => {
      const user = makeUser();
      const preferences = {
        announcements: false,
        deaths: true,
        pharmacy: true,
        events: false,
        ads: true,
        campaigns: false,
      };
      usersService.updateNotificationPreferences.mockResolvedValue(preferences);

      const dto: UpdateNotificationsDto = { announcements: false, ads: true, events: false };
      const result = await controller.updateNotifications(user, dto);

      expect(usersService.updateNotificationPreferences).toHaveBeenCalledWith(user.id, dto);
      expect(result).toEqual({ notification_preferences: preferences });
    });

    it('kısmi güncelleme ile çalışmalı', async () => {
      const user = makeUser();
      const updated = { ...user.notification_preferences, ads: true };
      usersService.updateNotificationPreferences.mockResolvedValue(updated);

      const dto: UpdateNotificationsDto = { ads: true };
      const result = await controller.updateNotifications(user, dto);

      expect(result.notification_preferences.ads).toBe(true);
    });

    it('service hatasını yukarı iletmeli', async () => {
      const user = makeUser();
      usersService.updateNotificationPreferences.mockRejectedValue(
        new Error('Bildirim hatası'),
      );

      await expect(
        controller.updateNotifications(user, {}),
      ).rejects.toThrow('Bildirim hatası');
    });
  });
});
