import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UserRole } from '../common/enums/user-role.enum';

// ─── Yardımcı fabrika fonksiyonları ─────────────────────────────────────────

const makeNeighborhood = (overrides: Partial<Neighborhood> = {}): Neighborhood =>
  ({
    id: 'nb-uuid-1',
    name: 'Merkez Mahallesi',
    slug: 'merkez',
    type: 'neighborhood',
    is_active: true,
    ...overrides,
  } as Neighborhood);

const makeUser = (overrides: Partial<User> = {}): User =>
  ({
    id: 'user-uuid-1',
    phone: '05551234567',
    username: 'ahmet123',
    age: 25,
    role: UserRole.USER,
    primary_neighborhood_id: 'nb-uuid-1',
    primary_neighborhood: makeNeighborhood(),
    location_type: 'neighborhood',
    notification_preferences: {
      announcements: true,
      deaths: true,
      pharmacy: true,
      events: true,
      ads: false,
      campaigns: false,
    },
    fcm_token: null as any,
    profile_photo_url: null as any,
    username_last_changed_at: undefined as unknown as Date,
    neighborhood_last_changed_at: undefined as unknown as Date,
    is_active: true,
    is_banned: false,
    ban_reason: null as any,
    banned_at: null as any,
    banned_by: null as any,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
    deleted_at: null,
    ...overrides,
  } as User);

// ─── Test suite ──────────────────────────────────────────────────────────────

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: jest.Mocked<Repository<User>>;
  let neighborhoodRepo: jest.Mocked<Repository<Neighborhood>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Neighborhood),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    neighborhoodRepo = module.get(getRepositoryToken(Neighborhood));
  });

  afterEach(() => jest.clearAllMocks());

  // ── findById ──────────────────────────────────────────────────────────────

  describe('findById', () => {
    it('kullanıcıyı relation\'larıyla döndürmeli', async () => {
      const user = makeUser();
      userRepo.findOne.mockResolvedValue(user);

      const result = await service.findById('user-uuid-1');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        relations: ['primary_neighborhood'],
      });
      expect(result).toBe(user);
    });

    it('kullanıcı bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.findById('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });

  // ── updateProfile ─────────────────────────────────────────────────────────

  describe('updateProfile', () => {
    describe('Kullanıcı adı güncelleme', () => {
      it('ilk kez kullanıcı adı değiştirebilmeli', async () => {
        const user = makeUser({ username_last_changed_at: undefined as unknown as Date });
        const updatedUser = makeUser({ username: 'yeni_kullanici', username_last_changed_at: new Date() });
        userRepo.findOne
          .mockResolvedValueOnce(user)       // findById içinde
          .mockResolvedValueOnce(null)       // benzersizlik kontrolü
          .mockResolvedValueOnce(updatedUser); // findById (reload)
        userRepo.save.mockResolvedValue(updatedUser);

        const dto: UpdateUserDto = { username: 'yeni_kullanici' };
        const result = await service.updateProfile('user-uuid-1', dto);

        expect(userRepo.save).toHaveBeenCalled();
        expect(result.username).toBe('yeni_kullanici');
      });

      it('30 günden fazla geçtiyse kullanıcı adı değiştirebilmeli', async () => {
        const lastChange = new Date();
        lastChange.setDate(lastChange.getDate() - 35); // 35 gün önce
        const user = makeUser({ username_last_changed_at: lastChange });
        const updatedUser = makeUser({ username: 'yeni_ad' });
        userRepo.findOne
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(updatedUser);
        userRepo.save.mockResolvedValue(updatedUser);

        const dto: UpdateUserDto = { username: 'yeni_ad' };
        const result = await service.updateProfile('user-uuid-1', dto);

        expect(userRepo.save).toHaveBeenCalled();
        expect(result).toBe(updatedUser);
      });

      it('30 gün dolmamışsa BadRequestException fırlatmalı', async () => {
        const lastChange = new Date();
        lastChange.setDate(lastChange.getDate() - 10); // 10 gün önce
        const user = makeUser({ username_last_changed_at: lastChange });
        userRepo.findOne.mockResolvedValueOnce(user);

        const dto: UpdateUserDto = { username: 'farkli_isim' };
        await expect(service.updateProfile('user-uuid-1', dto)).rejects.toThrow(BadRequestException);
      });

      it('başkası aynı kullanıcı adını kullanıyorsa ConflictException fırlatmalı', async () => {
        const user = makeUser({ username_last_changed_at: undefined as unknown as Date });
        const otherUser = makeUser({ id: 'diger-user', username: 'alinan_isim' });
        userRepo.findOne
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(otherUser); // başkası kullanıyor

        const dto: UpdateUserDto = { username: 'alinan_isim' };
        await expect(service.updateProfile('user-uuid-1', dto)).rejects.toThrow(ConflictException);
      });

      it('aynı kullanıcı adı girilirse (değişiklik yok) hiçbir kısıtlama uygulanmamalı', async () => {
        const user = makeUser({ username: 'ahmet123' });
        userRepo.findOne
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(user); // reload
        userRepo.save.mockResolvedValue(user);

        const dto: UpdateUserDto = { username: 'ahmet123' };
        await service.updateProfile('user-uuid-1', dto);

        // username değişmediği için unique kontrolü yapılmamalı
        expect(userRepo.findOne).toHaveBeenCalledTimes(2); // findById + reload
      });
    });

    describe('Mahalle güncelleme', () => {
      it('ilk kez mahalle değiştirebilmeli', async () => {
        const user = makeUser({ neighborhood_last_changed_at: undefined as unknown as Date });
        const neighborhood = makeNeighborhood({ id: 'nb-uuid-2' });
        const updatedUser = makeUser({ primary_neighborhood_id: 'nb-uuid-2' });
        userRepo.findOne
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(updatedUser); // reload
        neighborhoodRepo.findOne.mockResolvedValue(neighborhood);
        userRepo.save.mockResolvedValue(updatedUser);

        const dto: UpdateUserDto = { primary_neighborhood_id: 'nb-uuid-2' };
        const result = await service.updateProfile('user-uuid-1', dto);

        expect(neighborhoodRepo.findOne).toHaveBeenCalledWith({
          where: { id: 'nb-uuid-2', is_active: true },
        });
        expect(result).toBe(updatedUser);
      });

      it('30 gün dolmamışsa mahalle değiştirince BadRequestException fırlatmalı', async () => {
        const lastChange = new Date();
        lastChange.setDate(lastChange.getDate() - 5); // 5 gün önce
        const user = makeUser({ neighborhood_last_changed_at: lastChange });
        userRepo.findOne.mockResolvedValueOnce(user);

        const dto: UpdateUserDto = { primary_neighborhood_id: 'nb-uuid-99' };
        await expect(service.updateProfile('user-uuid-1', dto)).rejects.toThrow(BadRequestException);
      });

      it('mahalle bulunamazsa BadRequestException fırlatmalı', async () => {
        const user = makeUser({ neighborhood_last_changed_at: undefined as unknown as Date });
        userRepo.findOne.mockResolvedValueOnce(user);
        neighborhoodRepo.findOne.mockResolvedValue(null);

        const dto: UpdateUserDto = { primary_neighborhood_id: 'olmayan-nb' };
        await expect(service.updateProfile('user-uuid-1', dto)).rejects.toThrow(BadRequestException);
      });

      it('aynı mahalle girilirse kısıtlama uygulanmamalı', async () => {
        const user = makeUser({
          primary_neighborhood_id: 'nb-uuid-1',
          neighborhood_last_changed_at: new Date(), // yeni değiştirilmiş
        });
        userRepo.findOne
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(user); // reload
        userRepo.save.mockResolvedValue(user);

        const dto: UpdateUserDto = { primary_neighborhood_id: 'nb-uuid-1' };
        await service.updateProfile('user-uuid-1', dto);

        // Mahalle aynı olduğu için neighborhoodRepo kontrolü yapılmamalı
        expect(neighborhoodRepo.findOne).not.toHaveBeenCalled();
      });
    });

    describe('Diğer alanlar', () => {
      it('yaş güncelleyebilmeli', async () => {
        const user = makeUser();
        const updatedUser = makeUser({ age: 30 });
        userRepo.findOne
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(updatedUser);
        userRepo.save.mockResolvedValue(updatedUser);

        const dto: UpdateUserDto = { age: 30 };
        const result = await service.updateProfile('user-uuid-1', dto);

        expect(userRepo.save).toHaveBeenCalled();
        expect(result.age).toBe(30);
      });

      it('location_type güncelleyebilmeli', async () => {
        const user = makeUser({ location_type: 'neighborhood' });
        const updatedUser = makeUser({ location_type: 'village' });
        userRepo.findOne
          .mockResolvedValueOnce(user)
          .mockResolvedValueOnce(updatedUser);
        userRepo.save.mockResolvedValue(updatedUser);

        const dto: UpdateUserDto = { location_type: 'village' };
        const result = await service.updateProfile('user-uuid-1', dto);

        expect(result.location_type).toBe('village');
      });

      it('kullanıcı bulunamazsa NotFoundException fırlatmalı', async () => {
        userRepo.findOne.mockResolvedValue(null);

        await expect(service.updateProfile('olmayan-id', {})).rejects.toThrow(NotFoundException);
      });
    });
  });

  // ── updateNotificationPreferences ────────────────────────────────────────

  describe('updateNotificationPreferences', () => {
    it('tüm bildirimleri güncelleyebilmeli', async () => {
      const user = makeUser();
      userRepo.findOne.mockResolvedValue(user);
      userRepo.save.mockResolvedValue(user);

      const dto: UpdateNotificationsDto = {
        announcements: false,
        deaths: false,
        pharmacy: false,
        events: false,
        ads: true,
        campaigns: true,
      };

      const result = await service.updateNotificationPreferences('user-uuid-1', dto);

      expect(result).toEqual({
        announcements: false,
        deaths: false,
        pharmacy: false,
        events: false,
        ads: true,
        campaigns: true,
      });
    });

    it('kısmi güncelleme yapabilmeli (sadece belirtilen alanlar değişmeli)', async () => {
      const user = makeUser();
      userRepo.findOne.mockResolvedValue(user);
      userRepo.save.mockResolvedValue(user);

      const dto: UpdateNotificationsDto = { ads: true };
      const result = await service.updateNotificationPreferences('user-uuid-1', dto);

      // Diğer alanlar mevcut değerleriyle kalmalı
      expect(result.announcements).toBe(true);
      expect(result.deaths).toBe(true);
      expect(result.ads).toBe(true);
    });

    it('kullanıcı bulunamazsa NotFoundException fırlatmalı', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateNotificationPreferences('olmayan-id', {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── updateFcmToken ────────────────────────────────────────────────────────

  describe('updateFcmToken', () => {
    it('FCM token güncelleyebilmeli', async () => {
      userRepo.update.mockResolvedValue({ affected: 1 } as any);

      await service.updateFcmToken('user-uuid-1', 'new-fcm-token');

      expect(userRepo.update).toHaveBeenCalledWith('user-uuid-1', {
        fcm_token: 'new-fcm-token',
      });
    });
  });
});
