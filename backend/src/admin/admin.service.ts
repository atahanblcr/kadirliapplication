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
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';
import { QueryApprovalsDto } from './dto/query-approvals.dto';
import { RejectAdDto } from './dto/reject-ad.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { QueryScraperLogsDto } from './dto/query-scraper-logs.dto';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { AssignScheduleDto } from './dto/assign-schedule.dto';
import { QueryAdminCampaignsDto } from './dto/query-admin-campaigns.dto';
import { RejectCampaignDto } from './dto/reject-campaign.dto';
import { QueryIntercityRoutesDto } from './dto/query-intercity-routes.dto';
import { CreateIntercityRouteDto } from './dto/create-intercity-route.dto';
import { UpdateIntercityRouteDto } from './dto/update-intercity-route.dto';
import { CreateIntercityScheduleDto } from './dto/create-intercity-schedule.dto';
import { UpdateIntercityScheduleDto } from './dto/update-intercity-schedule.dto';
import { QueryIntracityRoutesDto } from './dto/query-intracity-routes.dto';
import { CreateIntracityRouteDto } from './dto/create-intracity-route.dto';
import { UpdateIntracityRouteDto } from './dto/update-intracity-route.dto';
import { CreateIntracityStopDto } from './dto/create-intracity-stop.dto';
import { UpdateIntracityStopDto } from './dto/update-intracity-stop.dto';
import { ReorderStopDto } from './dto/reorder-stop.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

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
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
    @InjectRepository(PharmacySchedule)
    private readonly pharmacyScheduleRepository: Repository<PharmacySchedule>,
    @InjectRepository(IntercityRoute)
    private readonly intercityRouteRepository: Repository<IntercityRoute>,
    @InjectRepository(IntercitySchedule)
    private readonly intercityScheduleRepository: Repository<IntercitySchedule>,
    @InjectRepository(IntracityRoute)
    private readonly intracityRouteRepository: Repository<IntracityRoute>,
    @InjectRepository(IntracityStop)
    private readonly intracityStopRepository: Repository<IntracityStop>,
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

  // ── PHARMACY: LİSTE ───────────────────────────────────────────────────────

  async getAdminPharmacies() {
    const pharmacies = await this.pharmacyRepository.find({
      order: { name: 'ASC' },
    });
    return { pharmacies };
  }

  // ── PHARMACY: OLUŞTUR ─────────────────────────────────────────────────────

  async createPharmacy(dto: CreatePharmacyDto) {
    const pharmacy = this.pharmacyRepository.create(dto);
    await this.pharmacyRepository.save(pharmacy);
    return { pharmacy };
  }

  // ── PHARMACY: GÜNCELLE ────────────────────────────────────────────────────

  async updatePharmacy(id: string, dto: UpdatePharmacyDto) {
    const pharmacy = await this.pharmacyRepository.findOne({ where: { id } });
    if (!pharmacy) throw new NotFoundException('Eczane bulunamadı');
    await this.pharmacyRepository.update(id, dto);
    return { pharmacy: { ...pharmacy, ...dto } };
  }

  // ── PHARMACY: SİL ─────────────────────────────────────────────────────────

  async deletePharmacy(id: string) {
    const pharmacy = await this.pharmacyRepository.findOne({ where: { id } });
    if (!pharmacy) throw new NotFoundException('Eczane bulunamadı');
    await this.pharmacyRepository.remove(pharmacy);
    return { message: 'Eczane silindi' };
  }

  // ── PHARMACY SCHEDULE: LİSTE (Admin) ─────────────────────────────────────

  async getAdminSchedule(start_date?: string, end_date?: string) {
    const qb = this.pharmacyScheduleRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.pharmacy', 'pharmacy')
      .orderBy('s.duty_date', 'ASC');

    if (start_date) {
      qb.andWhere('s.duty_date >= :start_date', { start_date });
    }
    if (end_date) {
      qb.andWhere('s.duty_date <= :end_date', { end_date });
    }

    const schedules = await qb.getMany();
    return {
      schedule: schedules.map((s) => ({
        id: s.id,
        pharmacy_id: s.pharmacy_id,
        pharmacy_name: s.pharmacy.name,
        duty_date: s.duty_date,
        start_time: s.start_time,
        end_time: s.end_time,
        source: s.source,
        created_at: s.created_at,
      })),
    };
  }

  // ── PHARMACY SCHEDULE: ATA ────────────────────────────────────────────────

  async assignSchedule(dto: AssignScheduleDto) {
    const pharmacy = await this.pharmacyRepository.findOne({
      where: { id: dto.pharmacy_id },
    });
    if (!pharmacy) throw new NotFoundException('Eczane bulunamadı');

    // Aynı tarihe önceki atamayı sil (tek nöbetçi per gün)
    await this.pharmacyScheduleRepository.delete({ duty_date: dto.date });

    const schedule = this.pharmacyScheduleRepository.create({
      pharmacy_id: dto.pharmacy_id,
      duty_date: dto.date,
      source: 'manual' as const,
    });
    await this.pharmacyScheduleRepository.save(schedule);

    return {
      schedule: {
        id: schedule.id,
        pharmacy_id: schedule.pharmacy_id,
        pharmacy_name: pharmacy.name,
        duty_date: schedule.duty_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
      },
    };
  }

  // ── PHARMACY SCHEDULE: SİL ────────────────────────────────────────────────

  async deleteScheduleEntry(id: string) {
    const schedule = await this.pharmacyScheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) throw new NotFoundException('Nöbet kaydı bulunamadı');
    await this.pharmacyScheduleRepository.remove(schedule);
    return { message: 'Nöbet silindi' };
  }

  // ── CAMPAIGN: LİSTE ───────────────────────────────────────────────────────

  async getAdminCampaigns(dto: QueryAdminCampaignsDto) {
    const { status, search, business_id, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.campaignRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.business', 'business')
      .leftJoinAndSelect('business.user', 'user')
      .leftJoinAndSelect('c.images', 'images')
      .leftJoinAndSelect('images.file', 'file')
      .where('c.deleted_at IS NULL')
      .orderBy('c.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (status) {
      qb.andWhere('c.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(c.title ILIKE :search OR business.business_name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (business_id) {
      qb.andWhere('c.business_id = :business_id', { business_id });
    }

    const [campaigns, total] = await qb.getManyAndCount();

    const mapped = campaigns.map((c) => ({
      id: c.id,
      business_id: c.business_id,
      business_name: c.business?.business_name ?? '',
      title: c.title,
      description: c.description,
      discount_rate: c.discount_percentage,
      code: c.discount_code ?? undefined,
      valid_from: c.start_date,
      valid_until: c.end_date,
      image_urls: (c.images ?? [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.file?.cdn_url ?? '')
        .filter(Boolean),
      status: c.status as 'pending' | 'approved' | 'rejected',
      views: 0,
      code_views: c.code_view_count,
      rejected_reason: c.rejected_reason ?? undefined,
      created_by: {
        id: c.business?.user?.id ?? '',
        username: c.business?.user?.username ?? '',
        business_name: c.business?.business_name ?? '',
      },
      created_at: c.created_at,
      updated_at: c.updated_at,
    }));

    return {
      campaigns: mapped,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  // ── CAMPAIGN: ONAYLA ──────────────────────────────────────────────────────

  async approveCampaign(adminId: string, id: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id, status: 'pending' },
    });

    if (!campaign) {
      throw new NotFoundException('Kampanya bulunamadı veya onay beklemiyordur');
    }

    await this.campaignRepository.update(id, {
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date(),
    });

    return { message: 'Kampanya onaylandı' };
  }

  // ── CAMPAIGN: REDDET ──────────────────────────────────────────────────────

  async rejectCampaign(adminId: string, id: string, dto: RejectCampaignDto) {
    const campaign = await this.campaignRepository.findOne({
      where: { id, status: 'pending' },
    });

    if (!campaign) {
      throw new NotFoundException('Kampanya bulunamadı veya onay beklemiyordur');
    }

    const rejected_reason = dto.note
      ? `${dto.reason}: ${dto.note}`
      : dto.reason;

    await this.campaignRepository.update(id, {
      status: 'rejected',
      rejected_reason,
    });

    return { message: 'Kampanya reddedildi' };
  }

  // ── CAMPAIGN: SİL ─────────────────────────────────────────────────────────

  async deleteAdminCampaign(id: string) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) throw new NotFoundException('Kampanya bulunamadı');
    await this.campaignRepository.softRemove(campaign);
    return { message: 'Kampanya silindi' };
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

  // ── ŞEHİRLERARASI HATLAR ─────────────────────────────────────────────────

  private mapIntercityRoute(r: IntercityRoute) {
    return {
      id: r.id,
      company_name: r.company_name ?? r.company ?? '',
      from_city: r.from_city ?? 'Kadirli',
      to_city: r.destination,
      duration_minutes: r.duration_minutes,
      price: Number(r.price),
      contact_phone: r.contact_phone ?? null,
      contact_website: r.contact_website ?? null,
      amenities: r.amenities ?? [],
      is_active: r.is_active,
      created_at: r.created_at,
      updated_at: r.updated_at,
      schedules: r.schedules?.map((s) => this.mapIntercitySchedule(s)) ?? [],
    };
  }

  private mapIntercitySchedule(s: IntercitySchedule) {
    const daysRaw = s.days_of_week;
    const days = Array.isArray(daysRaw)
      ? daysRaw.map(Number)
      : typeof daysRaw === 'string' && (daysRaw as string).length > 0
        ? (daysRaw as string).split(',').map(Number)
        : [];
    return {
      id: s.id,
      route_id: s.route_id,
      departure_time: s.departure_time,
      days_of_week: days,
      is_active: s.is_active,
      created_at: s.created_at,
    };
  }

  async getAdminIntercityRoutes(dto: QueryIntercityRoutesDto) {
    const { company_name, from_city, to_city, is_active, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.intercityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.schedules', 'schedules')
      .orderBy('r.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (company_name) {
      qb.andWhere(
        '(r.company_name ILIKE :cn OR r.company ILIKE :cn)',
        { cn: `%${company_name}%` },
      );
    }
    if (from_city) {
      qb.andWhere('r.from_city ILIKE :from_city', { from_city: `%${from_city}%` });
    }
    if (to_city) {
      qb.andWhere('r.destination ILIKE :to_city', { to_city: `%${to_city}%` });
    }
    if (is_active !== undefined) {
      qb.andWhere('r.is_active = :is_active', { is_active });
    }

    const [routes, total] = await qb.getManyAndCount();
    const meta = getPaginationMeta(total, page, limit);

    return { routes: routes.map((r) => this.mapIntercityRoute(r)), meta };
  }

  async getAdminIntercityRoute(id: string) {
    const route = await this.intercityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.schedules', 'schedules')
      .where('r.id = :id', { id })
      .orderBy('schedules.departure_time', 'ASC')
      .getOne();

    if (!route) {
      throw new NotFoundException('Şehirlerarası hat bulunamadı');
    }

    return { route: this.mapIntercityRoute(route) };
  }

  async createIntercityRoute(dto: CreateIntercityRouteDto) {
    const route = this.intercityRouteRepository.create({
      company_name: dto.company_name,
      company: dto.company_name, // backward compat
      from_city: dto.from_city,
      destination: dto.to_city, // backward compat
      duration_minutes: dto.duration_minutes,
      price: dto.price,
      contact_phone: dto.contact_phone,
      contact_website: dto.contact_website,
      amenities: dto.amenities ?? [],
      is_active: dto.is_active ?? true,
    });

    const saved = await this.intercityRouteRepository.save(route);
    const full = await this.getAdminIntercityRoute(saved.id);
    return full;
  }

  async updateIntercityRoute(id: string, dto: UpdateIntercityRouteDto) {
    const route = await this.intercityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehirlerarası hat bulunamadı');

    if (dto.company_name !== undefined) {
      route.company_name = dto.company_name;
      route.company = dto.company_name;
    }
    if (dto.from_city !== undefined) route.from_city = dto.from_city;
    if (dto.to_city !== undefined) route.destination = dto.to_city;
    if (dto.duration_minutes !== undefined) route.duration_minutes = dto.duration_minutes;
    if (dto.price !== undefined) route.price = dto.price;
    if (dto.contact_phone !== undefined) route.contact_phone = dto.contact_phone;
    if (dto.contact_website !== undefined) route.contact_website = dto.contact_website;
    if (dto.amenities !== undefined) route.amenities = dto.amenities;
    if (dto.is_active !== undefined) route.is_active = dto.is_active;

    await this.intercityRouteRepository.save(route);
    return this.getAdminIntercityRoute(id);
  }

  async deleteIntercityRoute(id: string) {
    const route = await this.intercityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehirlerarası hat bulunamadı');
    await this.intercityRouteRepository.remove(route);
  }

  async addIntercitySchedule(routeId: string, dto: CreateIntercityScheduleDto) {
    const route = await this.intercityRouteRepository.findOne({ where: { id: routeId } });
    if (!route) throw new NotFoundException('Şehirlerarası hat bulunamadı');

    const schedule = this.intercityScheduleRepository.create({
      route_id: routeId,
      departure_time: dto.departure_time,
      days_of_week: dto.days_of_week,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.intercityScheduleRepository.save(schedule);
    return { schedule: this.mapIntercitySchedule(saved) };
  }

  async updateIntercitySchedule(scheduleId: string, dto: UpdateIntercityScheduleDto) {
    const schedule = await this.intercityScheduleRepository.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) throw new NotFoundException('Sefer bulunamadı');

    if (dto.departure_time !== undefined) schedule.departure_time = dto.departure_time;
    if (dto.days_of_week !== undefined) schedule.days_of_week = dto.days_of_week;
    if (dto.is_active !== undefined) schedule.is_active = dto.is_active;

    const saved = await this.intercityScheduleRepository.save(schedule);
    return { schedule: this.mapIntercitySchedule(saved) };
  }

  async deleteIntercitySchedule(scheduleId: string) {
    const schedule = await this.intercityScheduleRepository.findOne({
      where: { id: scheduleId },
    });
    if (!schedule) throw new NotFoundException('Sefer bulunamadı');
    await this.intercityScheduleRepository.remove(schedule);
  }

  // ── ŞEHİR İÇİ HATLAR ─────────────────────────────────────────────────────

  private mapIntracityRoute(r: IntracityRoute, stops?: any[]) {
    return {
      id: r.id,
      line_number: r.route_number,
      name: r.route_name,
      color: r.color ?? null,
      first_departure: r.first_departure,
      last_departure: r.last_departure,
      frequency_minutes: r.frequency_minutes,
      fare: r.fare ? Number(r.fare) : 0,
      is_active: r.is_active,
      created_at: r.created_at,
      stops: stops ?? [],
    };
  }

  private mapIntracityStop(s: any) {
    return {
      id: s.id,
      route_id: s.route_id,
      stop_order: s.stop_order,
      name: s.stop_name,
      neighborhood_id: s.neighborhood_id ?? null,
      neighborhood_name: s.neighborhood_name ?? '',
      latitude: s.latitude ? Number(s.latitude) : undefined,
      longitude: s.longitude ? Number(s.longitude) : undefined,
      created_at: s.created_at,
    };
  }

  private async getStopsWithNeighborhood(routeId: string) {
    const raw = await this.intracityStopRepository
      .createQueryBuilder('s')
      .leftJoin('neighborhoods', 'n', 'n.id::text = s.neighborhood_id::text')
      .select([
        's.id as id',
        's.route_id as route_id',
        's.stop_name as stop_name',
        's.stop_order as stop_order',
        's.neighborhood_id as neighborhood_id',
        's.latitude as latitude',
        's.longitude as longitude',
        's.created_at as created_at',
        'n.name as neighborhood_name',
      ])
      .where('s.route_id = :routeId', { routeId })
      .orderBy('s.stop_order', 'ASC')
      .getRawMany();

    return raw.map((s) => this.mapIntracityStop(s));
  }

  async getAdminIntracityRoutes(dto: QueryIntracityRoutesDto) {
    const { line_number, is_active, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.intracityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.stops', 'stops')
      .orderBy('r.route_number', 'ASC')
      .addOrderBy('stops.stop_order', 'ASC')
      .skip(skip)
      .take(limit);

    if (line_number) {
      qb.andWhere('r.route_number ILIKE :ln', { ln: `%${line_number}%` });
    }
    if (is_active !== undefined) {
      qb.andWhere('r.is_active = :is_active', { is_active });
    }

    const [routes, total] = await qb.getManyAndCount();
    const meta = getPaginationMeta(total, page, limit);

    const mapped = routes.map((r) => ({
      ...this.mapIntracityRoute(r),
      stops: (r.stops ?? []).map((s) => ({
        id: s.id,
        route_id: s.route_id,
        stop_order: s.stop_order,
        name: s.stop_name,
        neighborhood_id: s.neighborhood_id ?? null,
        neighborhood_name: '',
        latitude: s.latitude ? Number(s.latitude) : undefined,
        longitude: s.longitude ? Number(s.longitude) : undefined,
        created_at: s.created_at,
      })),
    }));

    return { routes: mapped, meta };
  }

  async getAdminIntracityRoute(id: string) {
    const route = await this.intracityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');

    const stops = await this.getStopsWithNeighborhood(id);
    return { route: this.mapIntracityRoute(route, stops) };
  }

  async createIntracityRoute(dto: CreateIntracityRouteDto) {
    const route = this.intracityRouteRepository.create({
      route_number: dto.line_number,
      route_name: dto.name,
      color: dto.color,
      first_departure: dto.first_departure,
      last_departure: dto.last_departure,
      frequency_minutes: dto.frequency_minutes,
      fare: dto.fare,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.intracityRouteRepository.save(route);
    return this.getAdminIntracityRoute(saved.id);
  }

  async updateIntracityRoute(id: string, dto: UpdateIntracityRouteDto) {
    const route = await this.intracityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');

    if (dto.line_number !== undefined) route.route_number = dto.line_number;
    if (dto.name !== undefined) route.route_name = dto.name;
    if (dto.color !== undefined) route.color = dto.color;
    if (dto.first_departure !== undefined) route.first_departure = dto.first_departure;
    if (dto.last_departure !== undefined) route.last_departure = dto.last_departure;
    if (dto.frequency_minutes !== undefined) route.frequency_minutes = dto.frequency_minutes;
    if (dto.fare !== undefined) route.fare = dto.fare;
    if (dto.is_active !== undefined) route.is_active = dto.is_active;

    await this.intracityRouteRepository.save(route);
    return this.getAdminIntracityRoute(id);
  }

  async deleteIntracityRoute(id: string) {
    const route = await this.intracityRouteRepository.findOne({ where: { id } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');
    await this.intracityRouteRepository.remove(route);
  }

  async addIntracityStop(routeId: string, dto: CreateIntracityStopDto) {
    const route = await this.intracityRouteRepository.findOne({ where: { id: routeId } });
    if (!route) throw new NotFoundException('Şehir içi hat bulunamadı');

    // Get max stop_order for this route
    const maxOrderResult = await this.intracityStopRepository
      .createQueryBuilder('s')
      .select('MAX(s.stop_order)', 'max')
      .where('s.route_id = :routeId', { routeId })
      .getRawOne();

    const nextOrder = (maxOrderResult?.max ?? 0) + 1;

    const stop = this.intracityStopRepository.create({
      route_id: routeId,
      stop_name: dto.name,
      stop_order: nextOrder,
      neighborhood_id: dto.neighborhood_id,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });

    const saved = await this.intracityStopRepository.save(stop);

    // Fetch with neighborhood name
    const stops = await this.getStopsWithNeighborhood(routeId);
    const mappedStop = stops.find((s) => s.id === saved.id);
    return { stop: mappedStop };
  }

  async updateIntracityStop(stopId: string, dto: UpdateIntracityStopDto) {
    const stop = await this.intracityStopRepository.findOne({ where: { id: stopId } });
    if (!stop) throw new NotFoundException('Durak bulunamadı');

    if (dto.name !== undefined) stop.stop_name = dto.name;
    if (dto.neighborhood_id !== undefined) stop.neighborhood_id = dto.neighborhood_id;
    if (dto.latitude !== undefined) stop.latitude = dto.latitude;
    if (dto.longitude !== undefined) stop.longitude = dto.longitude;

    await this.intracityStopRepository.save(stop);

    const stops = await this.getStopsWithNeighborhood(stop.route_id);
    const mappedStop = stops.find((s) => s.id === stopId);
    return { stop: mappedStop };
  }

  async deleteIntracityStop(stopId: string) {
    const stop = await this.intracityStopRepository.findOne({ where: { id: stopId } });
    if (!stop) throw new NotFoundException('Durak bulunamadı');

    const routeId = stop.route_id;
    const deletedOrder = stop.stop_order;

    await this.intracityStopRepository.remove(stop);

    // Renumber remaining stops
    await this.intracityStopRepository
      .createQueryBuilder()
      .update(IntracityStop)
      .set({ stop_order: () => 'stop_order - 1' })
      .where('route_id = :routeId AND stop_order > :deletedOrder', {
        routeId,
        deletedOrder,
      })
      .execute();
  }

  async reorderIntracityStop(stopId: string, dto: ReorderStopDto) {
    const stop = await this.intracityStopRepository.findOne({ where: { id: stopId } });
    if (!stop) throw new NotFoundException('Durak bulunamadı');

    const { new_order } = dto;
    const old_order = stop.stop_order;
    const routeId = stop.route_id;

    if (old_order === new_order) {
      return { stop: this.mapIntracityStop(stop) };
    }

    // Shift other stops to make room
    if (new_order > old_order) {
      // Moving down: decrement stops between old+1 and new_order
      await this.intracityStopRepository
        .createQueryBuilder()
        .update(IntracityStop)
        .set({ stop_order: () => 'stop_order - 1' })
        .where('route_id = :routeId AND stop_order > :old AND stop_order <= :new', {
          routeId,
          old: old_order,
          new: new_order,
        })
        .execute();
    } else {
      // Moving up: increment stops between new_order and old-1
      await this.intracityStopRepository
        .createQueryBuilder()
        .update(IntracityStop)
        .set({ stop_order: () => 'stop_order + 1' })
        .where('route_id = :routeId AND stop_order >= :new AND stop_order < :old', {
          routeId,
          new: new_order,
          old: old_order,
        })
        .execute();
    }

    stop.stop_order = new_order;
    await this.intracityStopRepository.save(stop);

    const stops = await this.getStopsWithNeighborhood(routeId);
    const mappedStop = stops.find((s) => s.id === stopId);
    return { stop: mappedStop };
  }
}
