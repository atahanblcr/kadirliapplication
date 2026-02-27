import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersAdminService } from './users-admin.service';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';

describe('UsersAdminService', () => {
  let service: UsersAdminService;
  let userRepo: any;
  let adRepo: any;

  const mockUser = {
    id: 'user-1',
    phone: '+905551234567',
    username: 'testuser',
    role: 'REGULAR_USER',
    is_banned: false,
    ban_reason: null,
    banned_at: null,
    banned_by: null,
    primary_neighborhood_id: 'neighborhood-1',
    primary_neighborhood: { id: 'neighborhood-1', name: 'Merkez' },
  };

  beforeEach(async () => {
    // User Repository Mock
    userRepo = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    };

    // Ad Repository Mock
    adRepo = {
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersAdminService,
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Ad), useValue: adRepo },
      ],
    }).compile();

    service = module.get<UsersAdminService>(UsersAdminService);
  });

  describe('getUsers', () => {
    it('should return users with default pagination', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      const result = await service.getUsers({});

      expect(result.users).toEqual([mockUser]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
      expect(userRepo.skip).toHaveBeenCalledWith(0);
      expect(userRepo.take).toHaveBeenCalledWith(50);
    });

    it('should paginate users correctly', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 100]);

      const result = await service.getUsers({ page: 2, limit: 25 });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(25);
      expect(userRepo.skip).toHaveBeenCalledWith(25); // (2-1) * 25
    });

    it('should filter users by search (phone)', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      await service.getUsers({ search: '+905551234567' });

      expect(userRepo.andWhere).toHaveBeenCalledWith(
        '(u.phone ILIKE :search OR u.username ILIKE :search)',
        { search: '%+905551234567%' },
      );
    });

    it('should filter users by search (username)', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      await service.getUsers({ search: 'testuser' });

      expect(userRepo.andWhere).toHaveBeenCalledWith(
        '(u.phone ILIKE :search OR u.username ILIKE :search)',
        { search: '%testuser%' },
      );
    });

    it('should filter users by role', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      await service.getUsers({ role: 'ADMIN' });

      expect(userRepo.andWhere).toHaveBeenCalledWith('u.role = :role', {
        role: 'ADMIN',
      });
    });

    it('should filter users by is_banned status (banned)', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      await service.getUsers({ is_banned: true });

      expect(userRepo.andWhere).toHaveBeenCalledWith(
        'u.is_banned = :is_banned',
        { is_banned: true },
      );
    });

    it('should filter users by is_banned status (not banned)', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      await service.getUsers({ is_banned: false });

      expect(userRepo.andWhere).toHaveBeenCalledWith(
        'u.is_banned = :is_banned',
        { is_banned: false },
      );
    });

    it('should filter users by neighborhood_id', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      await service.getUsers({ neighborhood_id: 'neighborhood-1' });

      expect(userRepo.andWhere).toHaveBeenCalledWith(
        'u.primary_neighborhood_id = :neighborhood_id',
        { neighborhood_id: 'neighborhood-1' },
      );
    });

    it('should apply all filters together', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[mockUser], 1]);

      await service.getUsers({
        search: 'test',
        role: 'ADMIN',
        is_banned: true,
        neighborhood_id: 'neighborhood-1',
        page: 2,
        limit: 10,
      });

      expect(userRepo.skip).toHaveBeenCalledWith(10);
      expect(userRepo.take).toHaveBeenCalledWith(10);
      expect(userRepo.andWhere).toHaveBeenCalledWith(
        '(u.phone ILIKE :search OR u.username ILIKE :search)',
        { search: '%test%' },
      );
      expect(userRepo.andWhere).toHaveBeenCalledWith('u.role = :role', {
        role: 'ADMIN',
      });
      expect(userRepo.andWhere).toHaveBeenCalledWith(
        'u.is_banned = :is_banned',
        { is_banned: true },
      );
      expect(userRepo.andWhere).toHaveBeenCalledWith(
        'u.primary_neighborhood_id = :neighborhood_id',
        { neighborhood_id: 'neighborhood-1' },
      );
    });

    it('should return empty list when no users match', async () => {
      userRepo.getManyAndCount.mockResolvedValue([[], 0]);

      const result = await service.getUsers({});

      expect(result.users).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getUser', () => {
    it('should return user with ad stats', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      adRepo.count.mockResolvedValue(5);

      const result = await service.getUser('user-1');

      expect(result).toEqual({
        ...mockUser,
        stats: { total_ads: 5 },
      });
      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        relations: ['primary_neighborhood'],
      });
      expect(adRepo.count).toHaveBeenCalledWith({ where: { user_id: 'user-1' } });
    });

    it('should return user with zero ads', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      adRepo.count.mockResolvedValue(0);

      const result = await service.getUser('user-1');

      expect(result.stats.total_ads).toBe(0);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.getUser('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getUser('nonexistent')).rejects.toThrow(
        'Kullanıcı bulunamadı',
      );
    });
  });

  describe('banUser', () => {
    it('should ban user without duration', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.banUser('admin-1', 'user-1', {
        ban_reason: 'Spam',
      });

      expect(result.message).toBe('Kullanıcı banlandı');
      expect(result.banned_until).toBeNull();
      expect(userRepo.update).toHaveBeenCalledWith('user-1', {
        is_banned: true,
        ban_reason: 'Spam',
        banned_at: expect.any(Date),
        banned_by: 'admin-1',
      });
    });

    it('should ban user with duration (days)', async () => {
      const now = Date.now();
      jest.useFakeTimers().setSystemTime(now);

      userRepo.findOne.mockResolvedValue(mockUser);
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.banUser('admin-1', 'user-1', {
        ban_reason: 'Harassment',
        duration_days: 7,
      });

      expect(result.message).toBe('Kullanıcı banlandı');
      expect(result.banned_until).toEqual(
        new Date(now + 7 * 24 * 60 * 60 * 1000),
      );

      jest.useRealTimers();
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.banUser('admin-1', 'nonexistent', {
          ban_reason: 'Spam',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when user already banned', async () => {
      const bannedUser = { ...mockUser, is_banned: true };
      userRepo.findOne.mockResolvedValue(bannedUser);

      await expect(
        service.banUser('admin-1', 'user-1', {
          ban_reason: 'Spam',
        }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.banUser('admin-1', 'user-1', {
          ban_reason: 'Spam',
        }),
      ).rejects.toThrow('Kullanıcı zaten banlanmış');
    });
  });

  describe('unbanUser', () => {
    it('should unban user', async () => {
      const bannedUser = {
        ...mockUser,
        is_banned: true,
        ban_reason: 'Spam',
        banned_at: new Date(),
        banned_by: 'admin-1',
      };
      userRepo.findOne.mockResolvedValue(bannedUser);
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.unbanUser('admin-1', 'user-1');

      expect(result.message).toBe('Ban kaldırıldı');
      expect(userRepo.update).toHaveBeenCalledWith('user-1', {
        is_banned: false,
        ban_reason: null,
        banned_at: null,
        banned_by: null,
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.unbanUser('admin-1', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when user not banned', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);

      await expect(service.unbanUser('admin-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.unbanUser('admin-1', 'user-1')).rejects.toThrow(
        'Kullanıcı zaten banlı değil',
      );
    });
  });

  describe('changeUserRole', () => {
    it('should change user role to ADMIN', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.changeUserRole('admin-1', 'user-1', {
        role: 'ADMIN',
      });

      expect(result.message).toBe('Rol güncellendi');
      expect(result.role).toBe('ADMIN');
      expect(userRepo.update).toHaveBeenCalledWith('user-1', { role: 'ADMIN' });
    });

    it('should change user role to MODERATOR', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.changeUserRole('admin-1', 'user-1', {
        role: 'MODERATOR',
      });

      expect(result.role).toBe('MODERATOR');
    });

    it('should change user role back to REGULAR_USER', async () => {
      const adminUser = { ...mockUser, role: 'ADMIN' };
      userRepo.findOne.mockResolvedValue(adminUser);
      userRepo.update.mockResolvedValue({ affected: 1 });

      const result = await service.changeUserRole('admin-1', 'user-1', {
        role: 'REGULAR_USER',
      });

      expect(result.role).toBe('REGULAR_USER');
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.changeUserRole('admin-1', 'nonexistent', {
          role: 'ADMIN',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
