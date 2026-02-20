import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { User } from '../database/entities/user.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  // ── OTP İSTEME ──────────────────────────────────────────────────────────────

  async requestOtp(phone: string): Promise<{ message: string; expires_in: number; retry_after: number }> {
    const devMode = this.configService.get<string>('OTP_DEV_MODE') === 'true';
    const rateLimitKey = `otp:rate:${phone}`;
    const blockKey = `otp:block:${phone}`;

    // Engelli mi?
    const isBlocked = await this.redis.get(blockKey);
    if (isBlocked) {
      throw new BadRequestException('Çok fazla deneme. Lütfen bekleyin.');
    }

    // Rate limit: 10 OTP/saat
    const hourLimit = this.configService.get<number>('OTP_RATE_LIMIT_PER_HOUR', 10);
    const currentCount = await this.redis.incr(rateLimitKey);
    if (currentCount === 1) {
      await this.redis.expire(rateLimitKey, 3600);
    }
    if (currentCount > hourLimit) {
      throw new BadRequestException('Saatlik OTP limitine ulaştınız');
    }

    // OTP oluştur
    const otp = devMode ? '123456' : this.generateOtp();
    const ttl = this.configService.get<number>('OTP_TTL_SECONDS', 300);
    const otpKey = `otp:code:${phone}`;

    await this.redis.setex(otpKey, ttl, otp);

    if (!devMode) {
      await this.sendSms(phone, otp);
    } else {
      this.logger.warn(`[DEV MODE] OTP for ${phone}: ${otp}`);
    }

    return { message: 'OTP gönderildi', expires_in: ttl, retry_after: 60 };
  }

  // ── OTP DOĞRULAMA ────────────────────────────────────────────────────────────

  async verifyOtp(
    phone: string,
    otp: string,
  ): Promise<{
    is_new_user: boolean;
    temp_token?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    user?: Partial<User>;
  }> {
    const otpKey = `otp:code:${phone}`;
    const attemptsKey = `otp:attempts:${phone}`;
    const blockKey = `otp:block:${phone}`;

    const storedOtp = await this.redis.get(otpKey);
    if (!storedOtp) {
      throw new UnauthorizedException('OTP süresi dolmuş veya geçersiz');
    }

    // Yanlış deneme sayısı
    const maxAttempts = this.configService.get<number>('OTP_MAX_ATTEMPTS', 3);
    const attempts = await this.redis.incr(attemptsKey);
    if (attempts === 1) {
      await this.redis.expire(attemptsKey, 300);
    }

    if (attempts > maxAttempts) {
      const blockDuration = this.configService.get<number>('OTP_BLOCK_DURATION_MINUTES', 5);
      await this.redis.setex(blockKey, blockDuration * 60, '1');
      await this.redis.del(otpKey, attemptsKey);
      throw new UnauthorizedException('Çok fazla hatalı deneme. 5 dakika beklemeniz gerekiyor.');
    }

    if (storedOtp !== otp) {
      throw new UnauthorizedException('Geçersiz OTP');
    }

    // OTP doğru - temizle
    await this.redis.del(otpKey, attemptsKey);

    // Kullanıcı var mı?
    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ['primary_neighborhood'],
    });

    if (!user) {
      // Yeni kullanıcı - temp token
      const tempToken = this.jwtService.sign(
        { phone, type: 'registration' },
        { expiresIn: '30m' as any, secret: this.configService.get('JWT_SECRET') },
      );
      return { is_new_user: true, temp_token: tempToken };
    }

    // Mevcut kullanıcı - tam token
    const tokens = await this.generateTokens(user);
    return {
      is_new_user: false,
      ...tokens,
      user: {
        id: user.id,
        phone: user.phone,
        username: user.username,
        role: user.role,
        primary_neighborhood: user.primary_neighborhood,
      },
    };
  }

  // ── KAYIT TAMAMLAMA ──────────────────────────────────────────────────────────

  async register(
    phone: string,
    dto: RegisterDto,
  ): Promise<{ access_token: string; refresh_token: string; expires_in: number; user: Partial<User> }> {
    if (!dto.accept_terms) {
      throw new BadRequestException('Kullanım şartlarını kabul etmeniz gerekiyor');
    }

    // Username benzersiz mi?
    const existing = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existing) {
      throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
    }

    // Mahalle var mı?
    const neighborhood = await this.neighborhoodRepository.findOne({
      where: { id: dto.primary_neighborhood_id, is_active: true },
    });
    if (!neighborhood) {
      throw new BadRequestException('Seçilen mahalle bulunamadı');
    }

    // Kullanıcı oluştur
    const user = this.userRepository.create({
      phone,
      username: dto.username,
      age: dto.age,
      location_type: dto.location_type,
      primary_neighborhood_id: dto.primary_neighborhood_id,
    });

    const saved = await this.userRepository.save(user);
    const tokens = await this.generateTokens(saved);

    return {
      ...tokens,
      user: {
        id: saved.id,
        phone: saved.phone,
        username: saved.username,
        age: saved.age,
        role: saved.role,
        primary_neighborhood: neighborhood,
      },
    };
  }

  // ── REFRESH TOKEN ────────────────────────────────────────────────────────────

  async refreshToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.user_id, is_active: true },
      });

      if (!user) {
        throw new UnauthorizedException('Kullanıcı bulunamadı');
      }

      const accessToken = this.jwtService.sign(
        { user_id: user.id, role: user.role, phone: user.phone },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN', '30d') as any,
        },
      );

      return { access_token: accessToken, expires_in: 2592000 };
    } catch {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }

  // ── LOGOUT ───────────────────────────────────────────────────────────────────

  async logout(userId: string, fcmToken?: string): Promise<void> {
    if (fcmToken) {
      await this.userRepository.update(userId, { fcm_token: null as any });
    }
  }

  // ── YARDIMCI FONKSİYONLAR ────────────────────────────────────────────────────

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendSms(phone: string, otp: string): Promise<void> {
    // TODO: SMS provider entegrasyonu (Netgsm, İleti365, vb.)
    this.logger.log(`SMS gönderiliyor: ${phone} → ${otp}`);
  }

  async generateTokens(user: User): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const payload = { user_id: user.id, role: user.role, phone: user.phone };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN', '30d') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '90d') as any,
      }),
    ]);

    return { access_token, refresh_token, expires_in: 2592000 };
  }
}
