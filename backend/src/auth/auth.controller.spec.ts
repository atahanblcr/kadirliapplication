import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../database/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';

const mockAuthService = {
  requestOtp: jest.fn(),
  verifyOtp: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'test-secret';
    return null;
  }),
};

describe('AuthController', () => {
  let controller: AuthController;

  const mockUser: Partial<User> = {
    id: 'user-uuid-1234',
    phone: '05331234567',
    username: 'testuser',
    role: UserRole.USER,
    is_active: true,
    is_banned: false,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /auth/request-otp
  // ─────────────────────────────────────────────────────────────────────────────

  describe('requestOtp', () => {
    it('AuthService.requestOtp çağrılmalı ve sonuç dönmeli', async () => {
      const dto: RequestOtpDto = { phone: '05331234567' };
      const serviceResponse = { message: 'OTP gönderildi', expires_in: 300, retry_after: 60 };
      mockAuthService.requestOtp.mockResolvedValue(serviceResponse);

      const result = await controller.requestOtp(dto);

      expect(mockAuthService.requestOtp).toHaveBeenCalledWith('05331234567');
      expect(result).toEqual(serviceResponse);
    });

    it('Service hata fırlatırsa controller iletmeli', async () => {
      const dto: RequestOtpDto = { phone: '05331234567' };
      mockAuthService.requestOtp.mockRejectedValue(
        new UnauthorizedException('Çok fazla deneme'),
      );

      await expect(controller.requestOtp(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /auth/verify-otp
  // ─────────────────────────────────────────────────────────────────────────────

  describe('verifyOtp', () => {
    it('AuthService.verifyOtp phone ve otp ile çağrılmalı', async () => {
      const dto: VerifyOtpDto = { phone: '05331234567', otp: '123456' };
      const serviceResponse = { is_new_user: false, access_token: 'token', refresh_token: 'refresh', expires_in: 2592000 };
      mockAuthService.verifyOtp.mockResolvedValue(serviceResponse);

      const result = await controller.verifyOtp(dto);

      expect(mockAuthService.verifyOtp).toHaveBeenCalledWith('05331234567', '123456');
      expect(result).toEqual(serviceResponse);
    });

    it('Yeni kullanıcı → is_new_user=true ve temp_token dönmeli', async () => {
      const dto: VerifyOtpDto = { phone: '05331234567', otp: '123456' };
      mockAuthService.verifyOtp.mockResolvedValue({
        is_new_user: true,
        temp_token: 'temp-jwt',
      });

      const result = await controller.verifyOtp(dto);

      expect(result.is_new_user).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /auth/register
  // ─────────────────────────────────────────────────────────────────────────────

  describe('register', () => {
    const dto: RegisterDto = {
      username: 'newuser',
      age: 25,
      location_type: 'neighborhood',
      primary_neighborhood_id: 'neighborhood-uuid',
      accept_terms: true,
    };

    const makeTempToken = (payload: object) =>
      Buffer.from(JSON.stringify(payload)).toString('base64');

    it('Authorization header yoksa UnauthorizedException fırlatmalı', async () => {
      const req = { headers: {} };

      await expect(controller.register(req as never, dto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.register(req as never, dto)).rejects.toThrow(
        'Geçici token gerekli',
      );
    });

    it('"Bearer " prefix olmadan UnauthorizedException fırlatmalı', async () => {
      const req = { headers: { authorization: 'invalidtoken' } };

      await expect(controller.register(req as never, dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('Geçersiz JWT → UnauthorizedException fırlatmalı', async () => {
      const req = { headers: { authorization: 'Bearer bad-token' } };
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('invalid signature');
      });

      await expect(controller.register(req as never, dto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.register(req as never, dto)).rejects.toThrow(
        'Geçersiz veya süresi dolmuş token',
      );
    });

    it('Token tipi "registration" değilse UnauthorizedException fırlatmalı', async () => {
      const req = { headers: { authorization: 'Bearer valid-token' } };
      mockJwtService.verify.mockReturnValue({
        phone: '05331234567',
        type: 'access', // yanlış tip
      });

      await expect(controller.register(req as never, dto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.register(req as never, dto)).rejects.toThrow(
        'Geçersiz token tipi',
      );
    });

    it('Geçerli temp_token → AuthService.register çağrılmalı', async () => {
      const req = { headers: { authorization: 'Bearer valid-temp-token' } };
      mockJwtService.verify.mockReturnValue({
        phone: '05331234567',
        type: 'registration',
      });
      mockAuthService.register.mockResolvedValue({
        access_token: 'access',
        refresh_token: 'refresh',
        expires_in: 2592000,
        user: mockUser,
      });

      const result = await controller.register(req as never, dto);

      expect(mockAuthService.register).toHaveBeenCalledWith('05331234567', dto);
      expect(result.access_token).toBe('access');
    });

    it('JWT verify doğru secret ile çağrılmalı', async () => {
      const req = { headers: { authorization: 'Bearer some-token' } };
      mockJwtService.verify.mockReturnValue({
        phone: '05331234567',
        type: 'registration',
      });
      mockAuthService.register.mockResolvedValue({});

      await controller.register(req as never, dto);

      expect(mockJwtService.verify).toHaveBeenCalledWith('some-token', {
        secret: 'test-secret',
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /auth/refresh
  // ─────────────────────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('Refresh token yoksa UnauthorizedException fırlatmalı', async () => {
      await expect(controller.refresh(undefined as never)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(controller.refresh(undefined as never)).rejects.toThrow(
        'Refresh token gerekli',
      );
    });

    it('Boş string → UnauthorizedException fırlatmalı', async () => {
      await expect(controller.refresh('')).rejects.toThrow(UnauthorizedException);
    });

    it('Geçerli token → AuthService.refreshToken çağrılmalı', async () => {
      mockAuthService.refreshToken.mockResolvedValue({
        access_token: 'new-access-token',
        expires_in: 2592000,
      });

      const result = await controller.refresh('valid-refresh-token');

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        'valid-refresh-token',
      );
      expect(result.access_token).toBe('new-access-token');
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /auth/logout
  // ─────────────────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('AuthService.logout user.id ile çağrılmalı', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      await controller.logout(mockUser as User, undefined);

      expect(mockAuthService.logout).toHaveBeenCalledWith(
        mockUser.id,
        undefined,
      );
    });

    it('FCM token ile birlikte logout çağrılmalı', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      await controller.logout(mockUser as User, 'some-fcm-token');

      expect(mockAuthService.logout).toHaveBeenCalledWith(
        mockUser.id,
        'some-fcm-token',
      );
    });

    it('Başarılı logout → success message dönmeli', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(mockUser as User, undefined);

      expect(result).toEqual({ message: 'Çıkış başarılı' });
    });
  });
});
