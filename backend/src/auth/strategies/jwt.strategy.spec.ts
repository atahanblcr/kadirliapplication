import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtStrategy, JwtPayload } from './jwt.strategy';
import { User } from '../../database/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';

const mockUserRepository = {
  findOne: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'test-jwt-secret';
    return null;
  }),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockUser: Partial<User> = {
    id: 'user-uuid-1234',
    phone: '05331234567',
    username: 'testuser',
    role: UserRole.USER,
    is_active: true,
    is_banned: false,
    primary_neighborhood: {
      id: 'neighborhood-uuid',
      name: 'Merkez',
    } as never,
  };

  const mockPayload: JwtPayload = {
    user_id: 'user-uuid-1234',
    role: UserRole.USER,
    phone: '05331234567',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // validate
  // ─────────────────────────────────────────────────────────────────────────────

  describe('validate', () => {
    it('Geçerli payload → user döndürmeli', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await strategy.validate(mockPayload);

      expect(result).toEqual(mockUser);
    });

    it('Kullanıcı user_id ile aranmalı', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await strategy.validate(mockPayload);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1234' },
        relations: ['primary_neighborhood'],
      });
    });

    it('primary_neighborhood relation yüklenmeli', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await strategy.validate(mockPayload);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: ['primary_neighborhood'],
        }),
      );
    });

    it('Kullanıcı bulunamazsa UnauthorizedException fırlatmalı', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        'Hesabınız aktif değil',
      );
    });

    it('is_active=false → UnauthorizedException fırlatmalı', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        is_active: false,
      });

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        'Hesabınız aktif değil',
      );
    });

    it('is_banned=true → UnauthorizedException fırlatmalı', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        is_active: true,
        is_banned: true,
      });

      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(strategy.validate(mockPayload)).rejects.toThrow(
        'Hesabınız askıya alınmış',
      );
    });

    it('Aktif ve yasaklanmamış kullanıcı → error fırlatılmamalı', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        is_active: true,
        is_banned: false,
      });

      await expect(strategy.validate(mockPayload)).resolves.not.toThrow();
    });

    it('Payload\'dan user_id alınarak sorgu yapılmalı', async () => {
      const payload: JwtPayload = {
        user_id: 'different-user-uuid',
        role: UserRole.ADMIN,
        phone: '05559999999',
      };
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        id: 'different-user-uuid',
      });

      await strategy.validate(payload);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'different-user-uuid' },
        }),
      );
    });

    it('Admin rolündeki kullanıcı da validate edilebilmeli', async () => {
      const adminUser = {
        ...mockUser,
        id: 'admin-uuid',
        role: UserRole.ADMIN,
        is_active: true,
        is_banned: false,
      };
      mockUserRepository.findOne.mockResolvedValue(adminUser);

      const result = await strategy.validate({
        user_id: 'admin-uuid',
        role: UserRole.ADMIN,
        phone: '05331234567',
      });

      expect(result.role).toBe(UserRole.ADMIN);
    });
  });
});
