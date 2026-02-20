import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../database/entities/user.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';

// Redis mock
const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  setex: jest.fn(),
  incr: jest.fn(),
  expire: jest.fn(),
  del: jest.fn(),
};

// TypeORM repository factory
const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
});

// JWT service mock
const mockJwtService = {
  sign: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
};

// Config service mock
const mockConfigService = {
  get: jest.fn((key: string, defaultVal?: unknown) => {
    const config: Record<string, unknown> = {
      OTP_DEV_MODE: 'true',
      OTP_RATE_LIMIT_PER_HOUR: 10,
      OTP_TTL_SECONDS: 300,
      OTP_MAX_ATTEMPTS: 3,
      OTP_BLOCK_DURATION_MINUTES: 5,
      JWT_SECRET: 'test-jwt-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
      JWT_EXPIRES_IN: '30d',
      JWT_REFRESH_EXPIRES_IN: '90d',
    };
    return config[key] ?? defaultVal;
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let neighborhoodRepository: jest.Mocked<Repository<Neighborhood>>;

  // Test fixture: standart kullanıcı
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
    } as Neighborhood,
    primary_neighborhood_id: 'neighborhood-uuid',
    age: 25,
  };

  const mockNeighborhood: Partial<Neighborhood> = {
    id: 'neighborhood-uuid',
    name: 'Merkez',
    is_active: true,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(Neighborhood),
          useFactory: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    neighborhoodRepository = module.get(getRepositoryToken(Neighborhood));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // requestOtp
  // ─────────────────────────────────────────────────────────────────────────────

  describe('requestOtp', () => {
    const phone = '05331234567';

    it('DEV MODE: OTP başarıyla gönderilmeli (123456)', async () => {
      mockRedis.get.mockResolvedValue(null); // engel yok
      mockRedis.incr.mockResolvedValue(1);  // ilk istek

      const result = await service.requestOtp(phone);

      expect(result.message).toBe('OTP gönderildi');
      expect(result.expires_in).toBe(300);
      expect(result.retry_after).toBe(60);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        `otp:code:${phone}`,
        300,
        '123456', // DEV MODE sabit OTP
      );
    });

    it('İlk istekte rate limit TTL 3600 saniye olarak ayarlanmalı', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRedis.incr.mockResolvedValue(1);

      await service.requestOtp(phone);

      expect(mockRedis.expire).toHaveBeenCalledWith(`otp:rate:${phone}`, 3600);
    });

    it('Sonraki isteklerde TTL tekrar ayarlanmamalı', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRedis.incr.mockResolvedValue(5); // 5. istek

      await service.requestOtp(phone);

      expect(mockRedis.expire).not.toHaveBeenCalled();
    });

    it('Engellenmiş numara → BadRequestException fırlatmalı', async () => {
      mockRedis.get.mockResolvedValue('1'); // block kaydı var

      await expect(service.requestOtp(phone)).rejects.toThrow(BadRequestException);
      await expect(service.requestOtp(phone)).rejects.toThrow(
        'Çok fazla deneme. Lütfen bekleyin.',
      );
    });

    it('Saatlik limit aşıldığında → BadRequestException fırlatmalı', async () => {
      mockRedis.get.mockResolvedValue(null); // engel yok
      mockRedis.incr.mockResolvedValue(11); // 11. istek (limit 10)

      await expect(service.requestOtp(phone)).rejects.toThrow(BadRequestException);
      await expect(service.requestOtp(phone)).rejects.toThrow(
        'Saatlik OTP limitine ulaştınız',
      );
    });

    it('Limit kontrolü sırasında OTP yazılmamalı', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRedis.incr.mockResolvedValue(11);

      await expect(service.requestOtp(phone)).rejects.toThrow();
      expect(mockRedis.setex).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // verifyOtp
  // ─────────────────────────────────────────────────────────────────────────────

  describe('verifyOtp', () => {
    const phone = '05331234567';
    const otp = '123456';

    beforeEach(() => {
      mockRedis.get.mockImplementation((key: string) => {
        if (key === `otp:code:${phone}`) return Promise.resolve(otp);
        if (key === `otp:attempts:${phone}`) return Promise.resolve(null);
        return Promise.resolve(null);
      });
      mockRedis.incr.mockResolvedValue(1);
    });

    it('Yeni kullanıcı → temp_token döndürmeli', async () => {
      userRepository.findOne.mockResolvedValue(null); // kullanıcı yok
      mockJwtService.sign.mockReturnValue('temp-jwt-token');

      const result = await service.verifyOtp(phone, otp);

      expect(result.is_new_user).toBe(true);
      expect(result.temp_token).toBe('temp-jwt-token');
      expect(result.access_token).toBeUndefined();
    });

    it('Mevcut kullanıcı → access_token ve refresh_token döndürmeli', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.verifyOtp(phone, otp);

      expect(result.is_new_user).toBe(false);
      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.user?.id).toBe(mockUser.id);
    });

    it('Mevcut kullanıcı verisi doğru şekillendirilmeli', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.verifyOtp(phone, otp);

      expect(result.user).toEqual({
        id: mockUser.id,
        phone: mockUser.phone,
        username: mockUser.username,
        role: mockUser.role,
        primary_neighborhood: mockUser.primary_neighborhood,
      });
    });

    it('OTP süresi dolmuş → UnauthorizedException fırlatmalı', async () => {
      mockRedis.get.mockResolvedValue(null); // OTP yok

      await expect(service.verifyOtp(phone, otp)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.verifyOtp(phone, otp)).rejects.toThrow(
        'OTP süresi dolmuş veya geçersiz',
      );
    });

    it('Yanlış OTP → UnauthorizedException fırlatmalı', async () => {
      // get çağrısı: önce OTP kodu, sonra attempts
      mockRedis.get.mockImplementation((key: string) => {
        if (key === `otp:code:${phone}`) return Promise.resolve('654321');
        return Promise.resolve(null);
      });
      mockRedis.incr.mockResolvedValue(1);

      await expect(service.verifyOtp(phone, '000000')).rejects.toThrow(
        'Geçersiz OTP',
      );
    });

    it('Max deneme aşıldığında blok uygulanmalı ve OTP silinmeli', async () => {
      mockRedis.get.mockImplementation((key: string) => {
        if (key === `otp:code:${phone}`) return Promise.resolve(otp);
        return Promise.resolve(null);
      });
      mockRedis.incr.mockResolvedValue(4); // maxAttempts=3, 4 > 3

      await expect(service.verifyOtp(phone, '000000')).rejects.toThrow(
        'Çok fazla hatalı deneme',
      );

      expect(mockRedis.setex).toHaveBeenCalledWith(
        `otp:block:${phone}`,
        300, // 5 * 60
        '1',
      );
      expect(mockRedis.del).toHaveBeenCalledWith(
        `otp:code:${phone}`,
        `otp:attempts:${phone}`,
      );
    });

    it('Başarılı doğrulamadan sonra OTP ve attempts silinmeli', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.verifyOtp(phone, otp);

      expect(mockRedis.del).toHaveBeenCalledWith(
        `otp:code:${phone}`,
        `otp:attempts:${phone}`,
      );
    });

    it('İlk yanlış denemede attempts TTL ayarlanmalı', async () => {
      mockRedis.get.mockImplementation((key: string) => {
        if (key === `otp:code:${phone}`) return Promise.resolve('654321');
        return Promise.resolve(null);
      });
      mockRedis.incr.mockResolvedValue(1); // ilk deneme

      await expect(service.verifyOtp(phone, '000000')).rejects.toThrow();

      expect(mockRedis.expire).toHaveBeenCalledWith(
        `otp:attempts:${phone}`,
        300,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // register
  // ─────────────────────────────────────────────────────────────────────────────

  describe('register', () => {
    const phone = '05331234567';
    const dto = {
      username: 'newuser',
      age: 25,
      location_type: 'neighborhood' as const,
      primary_neighborhood_id: 'neighborhood-uuid',
      accept_terms: true,
    };

    beforeEach(() => {
      mockJwtService.signAsync.mockResolvedValue('token');
    });

    it('Kullanım şartları kabul edilmezse BadRequestException fırlatmalı', async () => {
      await expect(
        service.register(phone, { ...dto, accept_terms: false }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.register(phone, { ...dto, accept_terms: false }),
      ).rejects.toThrow('Kullanım şartlarını kabul etmeniz gerekiyor');
    });

    it('Kullanıcı adı mevcut ise ConflictException fırlatmalı', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);

      await expect(service.register(phone, dto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(phone, dto)).rejects.toThrow(
        'Bu kullanıcı adı zaten kullanılıyor',
      );
    });

    it('Mahalle bulunamazsa BadRequestException fırlatmalı', async () => {
      userRepository.findOne.mockResolvedValue(null); // username unique
      neighborhoodRepository.findOne.mockResolvedValue(null); // mahalle yok

      await expect(service.register(phone, dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.register(phone, dto)).rejects.toThrow(
        'Seçilen mahalle bulunamadı',
      );
    });

    it('Başarılı kayıt: kullanıcı oluşturulmalı ve token döndürülmeli', async () => {
      userRepository.findOne.mockResolvedValue(null);
      neighborhoodRepository.findOne.mockResolvedValue(mockNeighborhood as Neighborhood);
      const savedUser = { ...mockUser, username: dto.username } as User;
      userRepository.create.mockReturnValue(savedUser);
      userRepository.save.mockResolvedValue(savedUser);

      const result = await service.register(phone, dto);

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
      expect(result.user.username).toBe(dto.username);
      expect(result.user.id).toBe(mockUser.id);
    });

    it('Kayıtta create ve save çağrılmalı', async () => {
      userRepository.findOne.mockResolvedValue(null);
      neighborhoodRepository.findOne.mockResolvedValue(mockNeighborhood as Neighborhood);
      const savedUser = { ...mockUser } as User;
      userRepository.create.mockReturnValue(savedUser);
      userRepository.save.mockResolvedValue(savedUser);

      await service.register(phone, dto);

      expect(userRepository.create).toHaveBeenCalledWith({
        phone,
        username: dto.username,
        age: dto.age,
        location_type: dto.location_type,
        primary_neighborhood_id: dto.primary_neighborhood_id,
      });
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('Mahalle sadece is_active olanlar arasından aranmalı', async () => {
      userRepository.findOne.mockResolvedValue(null);
      neighborhoodRepository.findOne.mockResolvedValue(null);

      await expect(service.register(phone, dto)).rejects.toThrow();

      expect(neighborhoodRepository.findOne).toHaveBeenCalledWith({
        where: { id: dto.primary_neighborhood_id, is_active: true },
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // refreshToken
  // ─────────────────────────────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('Geçerli refresh token → yeni access_token döndürmeli', async () => {
      const payload = { user_id: 'user-uuid-1234' };
      mockJwtService.verify.mockReturnValue(payload);
      userRepository.findOne.mockResolvedValue(mockUser as User);
      mockJwtService.sign.mockReturnValue('new-access-token');

      const result = await service.refreshToken('valid-refresh-token');

      expect(result.access_token).toBe('new-access-token');
      expect(result.expires_in).toBe(2592000);
    });

    it('Geçersiz refresh token → UnauthorizedException fırlatmalı', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(
        service.refreshToken('invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
      await expect(
        service.refreshToken('invalid-token'),
      ).rejects.toThrow('Geçersiz refresh token');
    });

    it('Kullanıcı bulunamazsa UnauthorizedException fırlatmalı', async () => {
      mockJwtService.verify.mockReturnValue({ user_id: 'non-existent' });
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.refreshToken('valid-refresh-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Refresh token doğru secret ile verify edilmeli', async () => {
      mockJwtService.verify.mockReturnValue({ user_id: 'user-uuid-1234' });
      userRepository.findOne.mockResolvedValue(mockUser as User);
      mockJwtService.sign.mockReturnValue('token');

      await service.refreshToken('some-refresh-token');

      expect(mockJwtService.verify).toHaveBeenCalledWith('some-refresh-token', {
        secret: 'test-refresh-secret',
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // logout
  // ─────────────────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('FCM token varsa null olarak güncellenmeli', async () => {
      userRepository.update.mockResolvedValue({ affected: 1 } as never);

      await service.logout('user-uuid-1234', 'some-fcm-token');

      expect(userRepository.update).toHaveBeenCalledWith('user-uuid-1234', {
        fcm_token: null,
      });
    });

    it('FCM token yoksa update çağrılmamalı', async () => {
      await service.logout('user-uuid-1234');

      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('Başarılı çıkış için void döndürmeli', async () => {
      userRepository.update.mockResolvedValue({ affected: 1 } as never);
      const result = await service.logout('user-uuid-1234', 'fcm-token');

      expect(result).toBeUndefined();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // requestOtp - PRODUCTION MODE (non-dev)
  // ─────────────────────────────────────────────────────────────────────────────

  describe('requestOtp (non-dev mode)', () => {
    let prodModule: TestingModule;
    let prodService: AuthService;

    const prodConfigService = {
      get: jest.fn((key: string, defaultVal?: unknown) => {
        const config: Record<string, unknown> = {
          OTP_DEV_MODE: 'false', // gerçek mod
          OTP_RATE_LIMIT_PER_HOUR: 10,
          OTP_TTL_SECONDS: 300,
          OTP_MAX_ATTEMPTS: 3,
          OTP_BLOCK_DURATION_MINUTES: 5,
          JWT_SECRET: 'test-jwt-secret',
          JWT_REFRESH_SECRET: 'test-refresh-secret',
          JWT_EXPIRES_IN: '30d',
          JWT_REFRESH_EXPIRES_IN: '90d',
        };
        return config[key] ?? defaultVal;
      }),
    };

    beforeEach(async () => {
      jest.clearAllMocks();
      prodModule = await Test.createTestingModule({
        providers: [
          AuthService,
          { provide: getRepositoryToken(User), useFactory: mockRepository },
          { provide: getRepositoryToken(Neighborhood), useFactory: mockRepository },
          { provide: JwtService, useValue: mockJwtService },
          { provide: ConfigService, useValue: prodConfigService },
          { provide: 'default_IORedisModuleConnectionToken', useValue: mockRedis },
        ],
      }).compile();
      prodService = prodModule.get<AuthService>(AuthService);
    });

    it('Prod mode: OTP 6 haneli rastgele sayı olmalı (123456 değil)', async () => {
      mockRedis.get.mockResolvedValue(null);
      mockRedis.incr.mockResolvedValue(1);

      await prodService.requestOtp('05331234567');

      // setex çağrısında OTP parametresi /^\d{6}$/ formatında olmalı
      const setexCall = mockRedis.setex.mock.calls[0];
      const otpValue = setexCall[2];
      expect(otpValue).toMatch(/^\d{6}$/);
    });

    it('Prod mode: OTP 123456 olmamalı (rastgele üretilmeli)', async () => {
      // Math.random her çağrıda farklı sonuç vermeli - bu kez sabitliyoruz
      const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);
      mockRedis.get.mockResolvedValue(null);
      mockRedis.incr.mockResolvedValue(1);

      await prodService.requestOtp('05331234567');

      const setexCall = mockRedis.setex.mock.calls[0];
      const otpValue = setexCall[2];
      // Math.random() = 0.5 → floor(100000 + 0.5 * 900000) = floor(550000) = 550000
      expect(otpValue).toBe('550000');
      randomSpy.mockRestore();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // generateTokens
  // ─────────────────────────────────────────────────────────────────────────────

  describe('generateTokens', () => {
    it('Access ve refresh token üretmeli', async () => {
      mockJwtService.signAsync
        .mockResolvedValueOnce('access-token')
        .mockResolvedValueOnce('refresh-token');

      const result = await service.generateTokens(mockUser as User);

      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
      expect(result.expires_in).toBe(2592000);
    });

    it('Access token doğru payload ile üretilmeli', async () => {
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.generateTokens(mockUser as User);

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { user_id: mockUser.id, role: mockUser.role, phone: mockUser.phone },
        expect.objectContaining({ secret: 'test-jwt-secret' }),
      );
    });

    it('Refresh token farklı secret ile üretilmeli', async () => {
      mockJwtService.signAsync.mockResolvedValue('token');

      await service.generateTokens(mockUser as User);

      // İkinci çağrı (refresh token) farklı secret kullanmalı
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        expect.any(Object),
        expect.objectContaining({ secret: 'test-refresh-secret' }),
      );
    });
  });
});
