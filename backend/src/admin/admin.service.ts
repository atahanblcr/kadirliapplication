import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Event } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';
import { Pharmacy } from '../database/entities/pharmacy.entity';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { Ad } from '../database/entities/ad.entity';
import { DeathNotice } from '../database/entities/death-notice.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
import { QueryApprovalsDto } from './dto/query-approvals.dto';
import { RejectAdDto } from './dto/reject-ad.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { QueryAdminAdsDto } from './dto/query-admin-ads.dto';

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
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
    @InjectRepository(TaxiDriver)
    private readonly taxiDriverRepository: Repository<TaxiDriver>,
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

  // ── İLAN LİSTESİ (Admin) ─────────────────────────────────────────────────

  async getAdminAds(dto: QueryAdminAdsDto) {
    const page = parseInt(dto.page ?? '1', 10);
    const limit = parseInt(dto.limit ?? '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.adRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .leftJoinAndSelect('ad.category', 'category')
      .leftJoinAndSelect('ad.images', 'images')
      .where('ad.deleted_at IS NULL')
      .orderBy('ad.created_at', 'DESC');

    if (dto.status) {
      qb.andWhere('ad.status = :status', { status: dto.status });
    }
    if (dto.category_id) {
      qb.andWhere('ad.category_id = :category_id', { category_id: dto.category_id });
    }
    if (dto.user_id) {
      qb.andWhere('ad.user_id = :user_id', { user_id: dto.user_id });
    }
    if (dto.search) {
      qb.andWhere('(ad.title ILIKE :search OR ad.description ILIKE :search)', {
        search: `%${dto.search}%`,
      });
    }

    const [ads, total] = await qb.skip(skip).take(limit).getManyAndCount();
    return { ads, meta: getPaginationMeta(total, page, limit) };
  }

  // ── İLAN ONAYLA ──────────────────────────────────────────────────────────

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

  async getNeighborhoods(search?: string, type?: string, is_active?: boolean, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const qb = this.neighborhoodRepository
      .createQueryBuilder('n')
      .orderBy('n.display_order', 'ASC')
      .addOrderBy('n.name', 'ASC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('n.name ILIKE :search', { search: `%${search}%` });
    }
    if (type) {
      qb.andWhere('n.type = :type', { type });
    }
    if (is_active !== undefined) {
      qb.andWhere('n.is_active = :is_active', { is_active });
    }

    const [neighborhoods, total] = await qb.getManyAndCount();
    return { neighborhoods, meta: getPaginationMeta(total, page, limit) };
  }

  async createNeighborhood(dto: any) {
    const neighborhood = this.neighborhoodRepository.create(dto);
    const saved = await this.neighborhoodRepository.save(neighborhood);
    return { neighborhood: saved };
  }

  async updateNeighborhood(id: string, dto: any) {
    const neighborhood = await this.neighborhoodRepository.findOne({ where: { id } });
    if (!neighborhood) throw new NotFoundException('Mahalle bulunamadı');

    Object.assign(neighborhood, dto);
    const saved = await this.neighborhoodRepository.save(neighborhood);
    return { neighborhood: saved };
  }

  async deleteNeighborhood(id: string) {
    const neighborhood = await this.neighborhoodRepository.findOne({ where: { id } });
    if (!neighborhood) throw new NotFoundException('Mahalle bulunamadı');
    await this.neighborhoodRepository.delete(id);
    return { message: 'Mahalle silindi' };
  }


  // ══════════════════════════════════════════════════════════════════════════
  // ETKİNLİK YÖNETİMİ (Events Admin)
  // ══════════════════════════════════════════════════════════════════════════


  // ── İLAN SİL (ADMIN) ─────────────────────────────────────────────────────

  async deleteAdAsAdmin(id: string) {
    const ad = await this.adRepository.findOne({ where: { id } });
    if (!ad) throw new NotFoundException('İlan bulunamadı');
    await this.adRepository.softDelete(id);
    return { message: 'İlan silindi' };
  }

  // ── DASHBOARD: MODÜL KULLANIM ─────────────────────────────────────────────

  async getModuleUsage() {
    const [ads, announcements, deaths, campaigns, pharmacies, taxi, events] =
      await Promise.all([
        this.adRepository.count(),
        this.announcementRepository.count(),
        this.deathRepository.count(),
        this.campaignRepository.count(),
        this.pharmacyRepository.count(),
        this.taxiDriverRepository.count(),
        this.eventRepository.count(),
      ]);

    return [
      { name: 'İlanlar', count: ads },
      { name: 'Duyurular', count: announcements },
      { name: 'Vefat İlanları', count: deaths },
      { name: 'Kampanyalar', count: campaigns },
      { name: 'Eczaneler', count: pharmacies },
      { name: 'Taksi', count: taxi },
      { name: 'Etkinlikler', count: events },
    ].sort((a, b) => b.count - a.count);
  }

  // ── DASHBOARD: SON AKTİVİTELER ───────────────────────────────────────────

  async getRecentActivities() {
    const activities: {
      id: string;
      type: string;
      description: string;
      created_at: string;
    }[] = [];

    const [recentAds, recentAnnouncements, recentDeaths, recentUsers] =
      await Promise.all([
        this.adRepository.find({ order: { created_at: 'DESC' }, take: 5 }),
        this.announcementRepository.find({
          order: { created_at: 'DESC' },
          take: 4,
        }),
        this.deathRepository.find({ order: { created_at: 'DESC' }, take: 3 }),
        this.userRepository.find({ order: { created_at: 'DESC' }, take: 3 }),
      ]);

    activities.push(
      ...recentAds.map((ad) => ({
        id: ad.id,
        type: 'ad_created',
        description: `Yeni ilan: "${ad.title}"`,
        created_at: ad.created_at.toISOString(),
      })),
      ...recentAnnouncements.map((a) => ({
        id: a.id,
        type: 'announcement_created',
        description: `Duyuru: "${a.title}"`,
        created_at: a.created_at.toISOString(),
      })),
      ...recentDeaths.map((d) => ({
        id: d.id,
        type: 'death_notice',
        description: `Vefat ilanı: ${d.deceased_name}`,
        created_at: d.created_at.toISOString(),
      })),
      ...recentUsers.map((u) => ({
        id: u.id,
        type: 'user_register',
        description: `Yeni kullanıcı: ${u.username ?? u.phone ?? u.email ?? '?'}`,
        created_at: u.created_at.toISOString(),
      })),
    );

    activities.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return activities.slice(0, 10);
  }



  // ── ADMIN PROFİL ────────────────────────────────────────────────────────────

  async getAdminProfile(adminId: string) {
    const user = await this.userRepository.findOne({ where: { id: adminId } });
    if (!user) throw new NotFoundException('Admin bulunamadı');
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }

  async updateAdminProfile(adminId: string, dto: UpdateAdminProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: adminId } });
    if (!user) throw new NotFoundException('Admin bulunamadı');

    if (dto.username !== undefined) {
      await this.userRepository.update(adminId, { username: dto.username });
    }

    const updated = await this.userRepository.findOne({ where: { id: adminId } });
    return {
      id: updated!.id,
      email: updated!.email,
      username: updated!.username,
      role: updated!.role,
    };
  }

  async changeAdminPassword(adminId: string, dto: ChangePasswordDto) {
    // password alanı select: false olduğundan queryBuilder ile alıyoruz
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: adminId })
      .getOne();

    if (!user || !user.password) {
      throw new NotFoundException('Admin bulunamadı');
    }

    const isValid = await bcrypt.compare(dto.current_password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Mevcut şifre hatalı');
    }

    const hashed = await bcrypt.hash(dto.new_password, 10);
    await this.userRepository.update(adminId, { password: hashed });

    return { message: 'Şifre başarıyla değiştirildi' };
  }
}
