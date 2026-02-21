import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';
import { DeathNotice } from '../database/entities/death-notice.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
import { ScraperLog } from '../database/entities/scraper-log.entity';
import { QueryApprovalsDto } from './dto/query-approvals.dto';
import { RejectAdDto } from './dto/reject-ad.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { QueryScraperLogsDto } from './dto/query-scraper-logs.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
    @InjectRepository(DeathNotice)
    private readonly deathRepository: Repository<DeathNotice>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(ScraperLog)
    private readonly scraperLogRepository: Repository<ScraperLog>,
  ) {}

  // ── DASHBOARD ──────────────────────────────────────────────────────────────

  async getDashboard() {
    const today = new Date().toISOString().slice(0, 10);

    const [total_users, pending_ads, pending_deaths, pending_campaigns] =
      await Promise.all([
        this.userRepository.count(),
        this.adRepository.count({ where: { status: 'pending' } }),
        this.deathRepository.count({ where: { status: 'pending' } }),
        this.campaignRepository.count({ where: { status: 'pending' } }),
      ]);

    const [new_ads_today, announcements_today] = await Promise.all([
      this.adRepository
        .createQueryBuilder('a')
        .where('DATE(a.created_at) = :today', { today })
        .getCount(),
      this.announcementRepository
        .createQueryBuilder('a')
        .where('a.status = :status', { status: 'published' })
        .andWhere('DATE(a.created_at) = :today', { today })
        .getCount(),
    ]);

    const user_growth = await this.userRepository
      .createQueryBuilder('u')
      .select('DATE(u.created_at)', 'date')
      .addSelect('COUNT(u.id)', 'count')
      .where("u.created_at >= NOW() - INTERVAL '14 days'")
      .groupBy('DATE(u.created_at)')
      .orderBy('DATE(u.created_at)', 'ASC')
      .getRawMany();

    return {
      stats: {
        total_users,
        pending_approvals: {
          ads: pending_ads,
          deaths: pending_deaths,
          campaigns: pending_campaigns,
          total: pending_ads + pending_deaths + pending_campaigns,
        },
        announcements_sent_today: announcements_today,
        new_ads_today,
      },
      charts: {
        user_growth: user_growth.map((r) => ({
          date: r.date,
          count: parseInt(r.count, 10),
        })),
      },
    };
  }

  // ── ONAY BEKLEYENLİER ─────────────────────────────────────────────────────

  async getApprovals(dto: QueryApprovalsDto) {
    const { type, page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;
    const approvals: any[] = [];

    const calcHours = (createdAt: Date) =>
      Math.floor((Date.now() - new Date(createdAt).getTime()) / 3_600_000);

    if (!type || type === 'ad') {
      const ads = await this.adRepository
        .createQueryBuilder('a')
        .leftJoinAndSelect('a.user', 'user')
        .where('a.status = :status', { status: 'pending' })
        .andWhere('a.deleted_at IS NULL')
        .orderBy('a.created_at', 'ASC')
        .getMany();

      approvals.push(
        ...ads.map((ad) => ({
          type: 'ad',
          id: ad.id,
          content: {
            title: ad.title,
            user: {
              id: ad.user.id,
              username: ad.user.username,
              phone: ad.user.phone,
            },
          },
          created_at: ad.created_at,
          hours_pending: calcHours(ad.created_at),
        })),
      );
    }

    if (!type || type === 'death') {
      const deaths = await this.deathRepository
        .createQueryBuilder('d')
        .leftJoinAndSelect('d.adder', 'adder')
        .where('d.status = :status', { status: 'pending' })
        .andWhere('d.deleted_at IS NULL')
        .orderBy('d.created_at', 'ASC')
        .getMany();

      approvals.push(
        ...deaths.map((d) => ({
          type: 'death',
          id: d.id,
          content: {
            title: d.deceased_name,
            user: {
              id: d.adder.id,
              username: d.adder.username,
              phone: d.adder.phone,
            },
          },
          created_at: d.created_at,
          hours_pending: calcHours(d.created_at),
        })),
      );
    }

    if (!type || type === 'campaign') {
      const campaigns = await this.campaignRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.business', 'business')
        .leftJoinAndSelect('business.user', 'user')
        .where('c.status = :status', { status: 'pending' })
        .andWhere('c.deleted_at IS NULL')
        .orderBy('c.created_at', 'ASC')
        .getMany();

      approvals.push(
        ...campaigns.map((c) => ({
          type: 'campaign',
          id: c.id,
          content: {
            title: c.title,
            user: c.business?.user
              ? {
                  id: c.business.user.id,
                  username: c.business.user.username,
                  phone: c.business.user.phone,
                }
              : null,
          },
          created_at: c.created_at,
          hours_pending: calcHours(c.created_at),
        })),
      );
    }

    // Tür karışık geldiğinde created_at ASC sıralama
    approvals.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    const total = approvals.length;
    return { approvals: approvals.slice(skip, skip + limit), total, page, limit };
  }

  // ── İLAN ONAYLA ───────────────────────────────────────────────────────────

  async approveAd(adminId: string, id: string) {
    const ad = await this.adRepository.findOne({
      where: { id, status: 'pending' },
    });

    if (!ad) {
      throw new NotFoundException('İlan bulunamadı veya onay beklemiyordur');
    }

    await this.adRepository.update(id, {
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date(),
    });

    await this.notificationRepository.save(
      this.notificationRepository.create({
        user_id: ad.user_id,
        title: 'İlanınız onaylandı',
        body: `${ad.title} ilanınız yayınlandı`,
        type: 'ad_approved',
        related_type: 'ad',
        related_id: ad.id,
      }),
    );

    return { message: 'İlan onaylandı' };
  }

  // ── İLAN REDDET ───────────────────────────────────────────────────────────

  async rejectAd(adminId: string, id: string, dto: RejectAdDto) {
    const ad = await this.adRepository.findOne({
      where: { id, status: 'pending' },
    });

    if (!ad) {
      throw new NotFoundException('İlan bulunamadı veya onay beklemiyordur');
    }

    await this.adRepository.update(id, {
      status: 'rejected',
      rejected_reason: dto.rejected_reason,
      rejected_at: new Date(),
    });

    await this.notificationRepository.save(
      this.notificationRepository.create({
        user_id: ad.user_id,
        title: 'İlanınız reddedildi',
        body: `${ad.title} ilanınız reddedildi: ${dto.rejected_reason}`,
        type: 'ad_rejected',
        related_type: 'ad',
        related_id: ad.id,
      }),
    );

    return { message: 'İlan reddedildi' };
  }

  // ── KULLANICI LİSTESİ ─────────────────────────────────────────────────────

  async getUsers(dto: QueryUsersDto) {
    const { search, role, is_banned, neighborhood_id, page = 1, limit = 50 } =
      dto;
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.primary_neighborhood', 'neighborhood')
      .where('u.deleted_at IS NULL')
      .orderBy('u.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(u.phone ILIKE :search OR u.username ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      qb.andWhere('u.role = :role', { role });
    }

    if (is_banned !== undefined) {
      qb.andWhere('u.is_banned = :is_banned', { is_banned });
    }

    if (neighborhood_id) {
      qb.andWhere('u.primary_neighborhood_id = :neighborhood_id', {
        neighborhood_id,
      });
    }

    const [users, total] = await qb.getManyAndCount();
    return { users, total, page, limit };
  }

  // ── KULLANICI DETAY ───────────────────────────────────────────────────────

  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['primary_neighborhood'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const total_ads = await this.adRepository.count({ where: { user_id: id } });

    return { ...user, stats: { total_ads } };
  }

  // ── KULLANICI BAN KALDIR ──────────────────────────────────────────────────

  async unbanUser(adminId: string, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (!user.is_banned) {
      throw new BadRequestException('Kullanıcı zaten banlı değil');
    }

    await this.userRepository.update(userId, {
      is_banned: false,
      ban_reason: null as unknown as string,
      banned_at: null as unknown as Date,
      banned_by: null as unknown as string,
    });

    return { message: 'Ban kaldırıldı' };
  }

  // ── ROL DEĞİŞTİR ─────────────────────────────────────────────────────────

  async changeUserRole(adminId: string, userId: string, dto: ChangeRoleDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    await this.userRepository.update(userId, { role: dto.role });

    return { message: 'Rol güncellendi', role: dto.role };
  }

  // ── KULLANICI BANLA ───────────────────────────────────────────────────────

  async banUser(adminId: string, userId: string, dto: BanUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.is_banned) {
      throw new BadRequestException('Kullanıcı zaten banlanmış');
    }

    const bannedAt = new Date();
    await this.userRepository.update(userId, {
      is_banned: true,
      ban_reason: dto.ban_reason,
      banned_at: bannedAt,
      banned_by: adminId,
    });

    const banned_until = dto.duration_days
      ? new Date(bannedAt.getTime() + dto.duration_days * 24 * 60 * 60 * 1000)
      : null;

    return { message: 'Kullanıcı banlandı', banned_until };
  }

  // ── SCRAPER LOGLARI ───────────────────────────────────────────────────────

  async getScraperLogs(dto: QueryScraperLogsDto) {
    const { scraper_name, status, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.scraperLogRepository
      .createQueryBuilder('l')
      .orderBy('l.started_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (scraper_name) {
      qb.andWhere('l.scraper_name = :scraper_name', { scraper_name });
    }

    if (status) {
      qb.andWhere('l.status = :status', { status });
    }

    const [logs, total] = await qb.getManyAndCount();
    return { logs, total, page, limit };
  }

  // ── SCRAPER ÇALIŞTIR ──────────────────────────────────────────────────────

  async runScraper(name: string) {
    // Scraper job entegrasyonu ileride BullMQ ile eklenecek
    return { message: 'Scraper başlatıldı', scraper_name: name };
  }
}
