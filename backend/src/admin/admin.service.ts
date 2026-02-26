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
import { Ad } from '../database/entities/ad.entity';
import { Cemetery, DeathNotice, Mosque } from '../database/entities/death-notice.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { Campaign, CampaignImage } from '../database/entities/campaign.entity';
import { Business } from '../database/entities/business.entity';
import { BusinessCategory } from '../database/entities/business-category.entity';
import { FileEntity } from '../database/entities/file.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
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
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathDto } from './dto/update-death.dto';
import { QueryDeathsDto } from './dto/query-deaths.dto';
import { AdminCreateCampaignDto } from './dto/admin-create-campaign.dto';
import { AdminUpdateCampaignDto } from './dto/admin-update-campaign.dto';
import { CreateAdminBusinessDto } from './dto/create-admin-business.dto';
import { CreateBusinessCategoryDto } from './dto/create-business-category.dto';
import { CreateCemeteryDto } from './dto/create-cemetery.dto';
import { UpdateCemeteryDto } from './dto/update-cemetery.dto';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryAdminEventsDto } from './dto/query-admin-events.dto';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';
import { CreateGuideCategoryDto } from './dto/create-guide-category.dto';
import { UpdateGuideCategoryDto } from './dto/update-guide-category.dto';
import { CreateGuideItemDto } from './dto/create-guide-item.dto';
import { UpdateGuideItemDto } from './dto/update-guide-item.dto';
import { QueryGuideItemsDto } from './dto/query-guide-items.dto';
import {
  Place,
  PlaceCategory,
  PlaceImage,
} from '../database/entities/place.entity';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { UpdatePlaceCategoryDto } from './dto/update-place-category.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryAdminPlacesDto } from './dto/query-admin-places.dto';
import { AddPlaceImagesDto } from './dto/add-place-images.dto';
import { ReorderPlaceImagesDto } from './dto/reorder-place-images.dto';
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
    @InjectRepository(Cemetery)
    private readonly cemeteryRepository: Repository<Cemetery>,
    @InjectRepository(Mosque)
    private readonly mosqueRepository: Repository<Mosque>,
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessCategory)
    private readonly businessCategoryRepository: Repository<BusinessCategory>,
    @InjectRepository(CampaignImage)
    private readonly campaignImageRepository: Repository<CampaignImage>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
    @InjectRepository(GuideCategory)
    private readonly guideCategoryRepository: Repository<GuideCategory>,
    @InjectRepository(GuideItem)
    private readonly guideItemRepository: Repository<GuideItem>,
    @InjectRepository(PlaceCategory)
    private readonly placeCategoryRepository: Repository<PlaceCategory>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(PlaceImage)
    private readonly placeImageRepository: Repository<PlaceImage>,
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

  async getAdminPharmacies(search?: string) {
    const qb = this.pharmacyRepository
      .createQueryBuilder('p')
      .orderBy('p.name', 'ASC');

    if (search) {
      qb.andWhere('(p.name ILIKE :search OR p.address ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const pharmacies = await qb.getMany();
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
      start_time: dto.start_time ?? '19:00',
      end_time: dto.end_time ?? '09:00',
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

  // ── CAMPAIGN: İŞLETMELER (form dropdown) ─────────────────────────────────

  async getAdminBusinesses() {
    const businesses = await this.businessRepository.find({
      select: ['id', 'business_name'],
      order: { business_name: 'ASC' },
    });
    return { businesses };
  }

  async getBusinessCategories() {
    const categories = await this.businessCategoryRepository.find({
      where: { is_active: true },
      select: ['id', 'name'],
      order: { display_order: 'ASC', name: 'ASC' },
    });
    return { categories };
  }

  async createBusinessCategory(dto: CreateBusinessCategoryDto) {
    const slug = dto.name
      .toLowerCase()
      .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Slug çakışması varsa suffix ekle
    const uniqueSlug = await this.ensureUniqueSlug(slug);

    const category = new BusinessCategory();
    category.name = dto.name;
    category.slug = uniqueSlug;
    const saved = await this.businessCategoryRepository.save(category);
    return { id: saved.id, name: saved.name };
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let slug = base;
    let counter = 1;
    while (await this.businessCategoryRepository.findOne({ where: { slug } })) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }

  async createAdminBusiness(dto: CreateAdminBusinessDto) {
    const business = new Business();
    business.business_name = dto.business_name;
    if (dto.category_id) business.category_id = dto.category_id;
    business.phone = dto.phone;
    business.address = dto.address;
    business.user_id = null;
    const saved = await this.businessRepository.save(business);
    return { id: saved.id, business_name: saved.business_name };
  }

  // ── CAMPAIGN: DETAY ───────────────────────────────────────────────────────

  async getAdminCampaignDetail(id: string) {
    const c = await this.campaignRepository.findOne({
      where: { id },
      relations: ['business', 'business.user', 'images', 'images.file'],
    });
    if (!c) throw new NotFoundException('Kampanya bulunamadı');

    return {
      id: c.id,
      business_id: c.business_id,
      business_name: c.business?.business_name ?? '',
      title: c.title,
      description: c.description,
      discount_rate: c.discount_percentage,
      code: c.discount_code ?? undefined,
      valid_from: c.start_date,
      valid_until: c.end_date,
      images: (c.images ?? [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => ({
          id: img.id,
          file_id: img.file_id,
          url: img.file?.cdn_url ?? img.file?.storage_path ?? '',
        })),
      image_urls: (c.images ?? [])
        .sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.file?.cdn_url ?? '')
        .filter(Boolean),
      status: c.status,
      code_views: c.code_view_count,
      rejected_reason: c.rejected_reason ?? undefined,
      created_at: c.created_at,
      updated_at: c.updated_at,
    };
  }

  // ── CAMPAIGN: OLUŞTUR ─────────────────────────────────────────────────────

  async createAdminCampaign(adminId: string, dto: AdminCreateCampaignDto) {
    // Business varlığını kontrol et
    const business = await this.businessRepository.findOne({
      where: { id: dto.business_id },
    });
    if (!business) throw new NotFoundException('İşletme bulunamadı');

    // image_ids varsa file varlıklarını doğrula
    if (dto.image_ids && dto.image_ids.length > 0) {
      const files = await this.fileRepository.findBy({ id: In(dto.image_ids) });
      if (files.length !== dto.image_ids.length) {
        throw new BadRequestException('Bir veya daha fazla dosya bulunamadı');
      }
    }

    const campaign = this.campaignRepository.create({
      business_id: dto.business_id,
      title: dto.title,
      description: dto.description,
      discount_percentage: dto.discount_rate ?? 0,
      discount_code: dto.code ?? undefined,
      start_date: dto.valid_from,
      end_date: dto.valid_until,
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date(),
    });

    const saved = (await this.campaignRepository.save(campaign)) as Campaign;

    // Görsel kayıtlarını oluştur
    if (dto.image_ids && dto.image_ids.length > 0) {
      const imageEntities = dto.image_ids.map((fileId, idx) =>
        this.campaignImageRepository.create({
          campaign_id: saved.id,
          file_id: fileId,
          display_order: idx,
        }),
      );
      await this.campaignImageRepository.save(imageEntities);
    }

    return { message: 'Kampanya oluşturuldu', id: saved.id };
  }

  // ── CAMPAIGN: GÜNCELLE ────────────────────────────────────────────────────

  async updateAdminCampaign(id: string, dto: AdminUpdateCampaignDto) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) throw new NotFoundException('Kampanya bulunamadı');

    if (dto.business_id) {
      const business = await this.businessRepository.findOne({
        where: { id: dto.business_id },
      });
      if (!business) throw new NotFoundException('İşletme bulunamadı');
    }

    const updateData: Record<string, unknown> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.discount_rate !== undefined) updateData.discount_percentage = dto.discount_rate;
    if (dto.code !== undefined) updateData.discount_code = dto.code;
    if (dto.valid_from !== undefined) updateData.start_date = dto.valid_from;
    if (dto.valid_until !== undefined) updateData.end_date = dto.valid_until;
    if (dto.business_id !== undefined) updateData.business_id = dto.business_id;

    if (Object.keys(updateData).length > 0) {
      await this.campaignRepository.update(id, updateData as any);
    }

    // Görseller güncellendiyse mevcut görselleri sil, yenilerini ekle
    if (dto.image_ids !== undefined) {
      if (dto.image_ids.length > 0) {
        const files = await this.fileRepository.findBy({ id: In(dto.image_ids) });
        if (files.length !== dto.image_ids.length) {
          throw new BadRequestException('Bir veya daha fazla dosya bulunamadı');
        }
      }
      await this.campaignImageRepository.delete({ campaign_id: id });
      if (dto.image_ids.length > 0) {
        const imageEntities = dto.image_ids.map((fileId, idx) =>
          this.campaignImageRepository.create({
            campaign_id: id,
            file_id: fileId,
            display_order: idx,
          }),
        );
        await this.campaignImageRepository.save(imageEntities);
      }
    }

    return { message: 'Kampanya güncellendi' };
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
    const { search, company_name, from_city, to_city, is_active, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.intercityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.schedules', 'schedules')
      .orderBy('r.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(r.company_name ILIKE :search OR r.company ILIKE :search OR r.destination ILIKE :search)',
        { search: `%${search}%` },
      );
    }
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
      time_from_start: s.time_from_start ?? 0,
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
        's.time_from_start as time_from_start',
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
    const { search, line_number, is_active, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.intracityRouteRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.stops', 'stops')
      .orderBy('r.route_number', 'ASC')
      .addOrderBy('stops.stop_order', 'ASC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(r.route_number ILIKE :search OR r.route_name ILIKE :search)',
        { search: `%${search}%` },
      );
    }
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
        time_from_start: s.time_from_start ?? 0,
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
      time_from_start: dto.time_from_start,
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
    if (dto.time_from_start !== undefined) stop.time_from_start = dto.time_from_start;
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

  // ── DEATHS ADMIN CRUD ──────────────────────────────────────────────────────

  async getAllDeaths(dto: QueryDeathsDto) {
    const page = parseInt(dto.page ?? '1', 10);
    const limit = parseInt(dto.limit ?? '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.deathRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.cemetery', 'cemetery')
      .leftJoinAndSelect('d.mosque', 'mosque')
      .leftJoinAndSelect('d.neighborhood', 'neighborhood')
      .leftJoinAndSelect('d.photo_file', 'photo_file')
      .where('d.deleted_at IS NULL')
      .orderBy('d.funeral_date', 'DESC')
      .skip(skip)
      .take(limit);

    if (dto.search) {
      qb.andWhere('LOWER(d.deceased_name) LIKE :search', {
        search: `%${dto.search.toLowerCase()}%`,
      });
    }

    const [notices, total] = await qb.getManyAndCount();

    return {
      notices,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async createDeath(adminId: string, dto: CreateDeathDto) {
    const funeralDate = new Date(dto.funeral_date);
    const autoArchiveAt = new Date(funeralDate);
    autoArchiveAt.setDate(autoArchiveAt.getDate() + 7);

    const notice = this.deathRepository.create({
      deceased_name: dto.deceased_name,
      age: dto.age,
      funeral_date: dto.funeral_date,
      funeral_time: dto.funeral_time,
      cemetery_id: dto.cemetery_id,
      mosque_id: dto.mosque_id,
      condolence_address: dto.condolence_address,
      photo_file_id: dto.photo_file_id,
      neighborhood_id: dto.neighborhood_id,
      added_by: adminId,
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date(),
      auto_archive_at: autoArchiveAt,
    });

    await this.deathRepository.save(notice);

    const saved = await this.deathRepository.findOne({
      where: { id: notice.id },
      relations: ['cemetery', 'mosque', 'neighborhood', 'photo_file'],
    });

    return { notice: saved };
  }

  async updateDeath(adminId: string, id: string, dto: UpdateDeathDto) {
    const notice = await this.deathRepository.findOne({
      where: { id },
    });
    if (!notice) {
      throw new NotFoundException('Vefat ilanı bulunamadı');
    }

    if (dto.deceased_name !== undefined) notice.deceased_name = dto.deceased_name;
    if (dto.age !== undefined) notice.age = dto.age;
    if (dto.funeral_date !== undefined) {
      notice.funeral_date = dto.funeral_date;
      const funeralDate = new Date(dto.funeral_date);
      const autoArchiveAt = new Date(funeralDate);
      autoArchiveAt.setDate(autoArchiveAt.getDate() + 7);
      notice.auto_archive_at = autoArchiveAt;
    }
    if (dto.funeral_time !== undefined) notice.funeral_time = dto.funeral_time;
    if (dto.cemetery_id !== undefined) notice.cemetery_id = dto.cemetery_id;
    if (dto.mosque_id !== undefined) notice.mosque_id = dto.mosque_id;
    if (dto.condolence_address !== undefined) notice.condolence_address = dto.condolence_address;
    if (dto.photo_file_id !== undefined) notice.photo_file_id = dto.photo_file_id;
    if (dto.neighborhood_id !== undefined) notice.neighborhood_id = dto.neighborhood_id;

    await this.deathRepository.save(notice);

    const updated = await this.deathRepository.findOne({
      where: { id },
      relations: ['cemetery', 'mosque', 'neighborhood', 'photo_file'],
    });

    return { notice: updated };
  }

  async deleteDeath(id: string) {
    const notice = await this.deathRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException('Vefat ilanı bulunamadı');
    }
    await this.deathRepository.softDelete(id);
    return { success: true };
  }

  async getCemeteries() {
    const cemeteries = await this.cemeteryRepository.find({
      order: { name: 'ASC' },
    });
    return { cemeteries };
  }

  async createCemetery(dto: CreateCemeteryDto) {
    const cemetery = this.cemeteryRepository.create(dto);
    await this.cemeteryRepository.save(cemetery);
    return { cemetery };
  }

  async updateCemetery(id: string, dto: UpdateCemeteryDto) {
    const cemetery = await this.cemeteryRepository.findOne({ where: { id } });
    if (!cemetery) throw new NotFoundException('Mezarlık bulunamadı');
    await this.cemeteryRepository.update(id, dto);
    return { cemetery: { ...cemetery, ...dto } };
  }

  async deleteCemetery(id: string) {
    const cemetery = await this.cemeteryRepository.findOne({ where: { id } });
    if (!cemetery) throw new NotFoundException('Mezarlık bulunamadı');
    await this.cemeteryRepository.remove(cemetery);
    return { message: 'Mezarlık silindi' };
  }

  // ── MOSQUE CRUD ──────────────────────────────────────────────────────────────

  async getMosques() {
    const mosques = await this.mosqueRepository.find({
      order: { name: 'ASC' },
    });
    return { mosques };
  }

  async createMosque(dto: CreateMosqueDto) {
    const mosque = this.mosqueRepository.create(dto);
    await this.mosqueRepository.save(mosque);
    return { mosque };
  }

  async updateMosque(id: string, dto: UpdateMosqueDto) {
    const mosque = await this.mosqueRepository.findOne({ where: { id } });
    if (!mosque) throw new NotFoundException('Cami bulunamadı');
    await this.mosqueRepository.update(id, dto);
    return { mosque: { ...mosque, ...dto } };
  }

  async deleteMosque(id: string) {
    const mosque = await this.mosqueRepository.findOne({ where: { id } });
    if (!mosque) throw new NotFoundException('Cami bulunamadı');
    await this.mosqueRepository.remove(mosque);
    return { message: 'Cami silindi' };
  }

  // ── NEIGHBORHOOD CRUD ────────────────────────────────────────────────────────

  async getDeathNeighborhoods() {
    const neighborhoods = await this.neighborhoodRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC', name: 'ASC' },
    });
    return { neighborhoods };
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

  async createNeighborhood(dto: CreateNeighborhoodDto) {
    // Auto-generate slug if not provided
    if (!dto.slug) {
      (dto as any).slug = dto.name
        .toLowerCase()
        .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i')
        .replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const neighborhood = this.neighborhoodRepository.create(dto);
    await this.neighborhoodRepository.save(neighborhood);
    return { neighborhood };
  }

  async updateNeighborhood(id: string, dto: UpdateNeighborhoodDto) {
    const neighborhood = await this.neighborhoodRepository.findOne({ where: { id } });
    if (!neighborhood) throw new NotFoundException('Mahalle bulunamadı');
    await this.neighborhoodRepository.update(id, dto);
    return { neighborhood: { ...neighborhood, ...dto } };
  }

  async deleteNeighborhood(id: string) {
    const neighborhood = await this.neighborhoodRepository.findOne({ where: { id } });
    if (!neighborhood) throw new NotFoundException('Mahalle bulunamadı');
    await this.neighborhoodRepository.remove(neighborhood);
    return { message: 'Mahalle silindi' };
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ETKİNLİK YÖNETİMİ (Events Admin)
  // ══════════════════════════════════════════════════════════════════════════

  private mapEvent(event: Event) {
    return {
      id: event.id,
      title: event.title,
      description: event.description ?? null,
      category_id: event.category_id ?? null,
      category: event.category
        ? { id: event.category.id, name: event.category.name, icon: event.category.icon ?? null }
        : null,
      event_date: event.event_date,
      event_time: event.event_time,
      duration_minutes: event.duration_minutes ?? null,
      venue_name: event.venue_name ?? null,
      venue_address: event.venue_address ?? null,
      is_local: event.is_local,
      city: event.city ?? null,
      latitude: event.latitude ?? null,
      longitude: event.longitude ?? null,
      organizer: event.organizer ?? null,
      ticket_price: event.ticket_price ?? null,
      is_free: event.is_free,
      age_restriction: event.age_restriction ?? null,
      capacity: event.capacity ?? null,
      website_url: event.website_url ?? null,
      ticket_url: event.ticket_url ?? null,
      cover_image_id: event.cover_image_id ?? null,
      cover_image_url: (event.cover_image as any)?.url ?? null,
      status: event.status,
      images: event.images?.map((img) => ({
        id: img.id,
        file_id: img.file_id,
        url: (img.file as any)?.url ?? null,
        display_order: img.display_order,
      })) ?? [],
      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  }

  private generateEventSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .trim();
  }

  // ── ETKİNLİK KATEGORİLERİ: LİSTE ─────────────────────────────────────────

  async getEventCategories() {
    const categories = await this.eventCategoryRepository.find({
      order: { display_order: 'ASC', name: 'ASC' },
    });
    return { categories };
  }

  // ── ETKİNLİK KATEGORİSİ: OLUŞTUR ─────────────────────────────────────────

  async createEventCategory(dto: CreateEventCategoryDto) {
    const baseSlug = this.generateEventSlug(dto.name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.eventCategoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const category = this.eventCategoryRepository.create({
      name: dto.name,
      slug,
      icon: dto.icon,
      is_active: dto.is_active ?? true,
      display_order: dto.display_order ?? 0,
    });

    const saved = await this.eventCategoryRepository.save(category);
    return { category: saved };
  }

  // ── ETKİNLİKLER: LİSTE ────────────────────────────────────────────────────

  async getAdminEvents(dto: QueryAdminEventsDto) {
    const {
      search,
      category_id,
      start_date,
      end_date,
      status,
      is_local,
      page = 1,
      limit = 20,
    } = dto;

    const qb = this.eventRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.category', 'category')
      .leftJoinAndSelect('e.cover_image', 'cover_image');

    if (search) {
      qb.andWhere(
        '(e.title ILIKE :search OR e.venue_name ILIKE :search OR e.organizer ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category_id) {
      qb.andWhere('e.category_id = :category_id', { category_id });
    }

    if (start_date) {
      qb.andWhere('e.event_date >= :start_date', { start_date });
    }

    if (end_date) {
      qb.andWhere('e.event_date <= :end_date', { end_date });
    }

    if (status) {
      qb.andWhere('e.status = :status', { status });
    }

    if (is_local === true) {
      qb.andWhere('e.is_local = TRUE');
    } else if (is_local === false) {
      qb.andWhere('e.is_local = FALSE');
    }

    qb.orderBy('e.event_date', 'ASC').addOrderBy('e.event_time', 'ASC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [events, total] = await qb.getManyAndCount();

    return {
      events: events.map((e) => this.mapEvent(e)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  // ── ETKİNLİK: DETAY ───────────────────────────────────────────────────────

  async getAdminEvent(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    if (!event) throw new NotFoundException('Etkinlik bulunamadı');

    return { event: this.mapEvent(event) };
  }

  // ── ETKİNLİK: OLUŞTUR ────────────────────────────────────────────────────

  async createEvent(dto: CreateEventDto, userId: string) {
    if (dto.category_id) {
      const cat = await this.eventCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const event = this.eventRepository.create({
      title: dto.title,
      description: dto.description,
      category_id: dto.category_id,
      event_date: dto.event_date,
      event_time: dto.event_time,
      duration_minutes: dto.duration_minutes,
      venue_name: dto.venue_name,
      venue_address: dto.venue_address,
      is_local: dto.is_local ?? true,
      city: dto.city,
      latitude: dto.latitude,
      longitude: dto.longitude,
      organizer: dto.organizer,
      ticket_price: dto.ticket_price,
      is_free: dto.is_free ?? true,
      age_restriction: dto.age_restriction,
      capacity: dto.capacity,
      website_url: dto.website_url,
      ticket_url: dto.ticket_url,
      cover_image_id: dto.cover_image_id,
      status: (dto.status as any) ?? 'published',
      created_by: userId,
    });

    const saved = await this.eventRepository.save(event);

    const full = await this.eventRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'cover_image'],
    });

    return { event: this.mapEvent(full!) };
  }

  // ── ETKİNLİK: GÜNCELLE ────────────────────────────────────────────────────

  async updateEvent(id: string, dto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Etkinlik bulunamadı');

    if (dto.category_id !== undefined && dto.category_id !== null) {
      const cat = await this.eventCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const fields: (keyof UpdateEventDto)[] = [
      'title', 'description', 'category_id', 'event_date', 'event_time',
      'duration_minutes', 'venue_name', 'venue_address', 'is_local', 'city',
      'latitude', 'longitude', 'organizer', 'ticket_price', 'is_free',
      'age_restriction', 'capacity', 'website_url', 'ticket_url',
      'cover_image_id', 'status',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (event as any)[field] = dto[field];
      }
    }

    await this.eventRepository.save(event);

    const updated = await this.eventRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { event: this.mapEvent(updated!) };
  }

  // ── ETKİNLİK: SİL ────────────────────────────────────────────────────────

  async deleteEvent(id: string) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Etkinlik bulunamadı');
    await this.eventRepository.softDelete(id);
  }

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

  // ════════════════════════════════════════════════════════════════════════
  // REHBEr MODÜLÜ
  // ════════════════════════════════════════════════════════════════════════

  // ── REHBEr KATEGORİLERİ: LİSTE (HİYERARŞİK) ──────────────────────────

  async getGuideCategories() {
    const categories = await this.guideCategoryRepository.find({
      relations: ['parent', 'children'],
      order: { display_order: 'ASC', name: 'ASC' },
    });

    // Sadece kök kategorileri döndür, children ile birlikte
    const roots = categories.filter((c) => !c.parent_id);

    return {
      categories: roots.map((cat) => this.mapGuideCategory(cat)),
    };
  }

  // ── REHBEr KATEGORİSİ: OLUŞTUR ────────────────────────────────────────

  async createGuideCategory(dto: CreateGuideCategoryDto) {
    // parent_id varsa mevcut olduğunu kontrol et
    if (dto.parent_id) {
      const parent = await this.guideCategoryRepository.findOne({
        where: { id: dto.parent_id },
      });
      if (!parent) throw new BadRequestException('Üst kategori bulunamadı');
      if (parent.parent_id) {
        throw new BadRequestException('Maksimum 2 seviye hiyerarşi desteklenir');
      }
    }

    const slug = await this.generateGuideSlug(dto.name);

    const category = this.guideCategoryRepository.create({
      name: dto.name,
      slug,
      parent_id: dto.parent_id,
      icon: dto.icon,
      color: dto.color,
      display_order: dto.display_order ?? 0,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.guideCategoryRepository.save(category);

    const full = await this.guideCategoryRepository.findOne({
      where: { id: saved.id },
      relations: ['parent', 'children'],
    });

    return { category: this.mapGuideCategory(full!) };
  }

  // ── REHBEr KATEGORİSİ: GÜNCELLE ───────────────────────────────────────

  async updateGuideCategory(id: string, dto: UpdateGuideCategoryDto) {
    const category = await this.guideCategoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    // Circular reference kontrolü
    if (dto.parent_id !== undefined) {
      if (dto.parent_id === id) {
        throw new BadRequestException('Kategori kendisinin üst kategorisi olamaz');
      }
      if (dto.parent_id) {
        const parent = await this.guideCategoryRepository.findOne({
          where: { id: dto.parent_id },
        });
        if (!parent) throw new BadRequestException('Üst kategori bulunamadı');
        if (parent.parent_id) {
          throw new BadRequestException('Maksimum 2 seviye hiyerarşi desteklenir');
        }
      }
    }

    const fields: (keyof UpdateGuideCategoryDto)[] = [
      'name', 'parent_id', 'icon', 'color', 'display_order', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (category as any)[field] = dto[field];
      }
    }

    await this.guideCategoryRepository.save(category);

    const updated = await this.guideCategoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    return { category: this.mapGuideCategory(updated!) };
  }

  // ── REHBEr KATEGORİSİ: SİL ────────────────────────────────────────────

  async deleteGuideCategory(id: string) {
    const category = await this.guideCategoryRepository.findOne({
      where: { id },
      relations: ['children', 'items'],
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        'Alt kategorileri olan bir kategori silinemez. Önce alt kategorileri silin.',
      );
    }

    if (category.items && category.items.length > 0) {
      throw new BadRequestException(
        'İçerik bulunan kategori silinemez. Önce içerikleri silin veya taşıyın.',
      );
    }

    await this.guideCategoryRepository.delete(id);
  }

  // ── REHBEr İÇERİKLERİ: LİSTE ─────────────────────────────────────────

  async getGuideItems(dto: QueryGuideItemsDto) {
    const { search, category_id, is_active, page = 1, limit = 20 } = dto;

    const qb = this.guideItemRepository
      .createQueryBuilder('gi')
      .leftJoinAndSelect('gi.category', 'category')
      .leftJoinAndSelect('category.parent', 'parent');

    if (search) {
      qb.andWhere(
        '(gi.name ILIKE :search OR gi.phone ILIKE :search OR gi.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category_id) {
      qb.andWhere('gi.category_id = :category_id', { category_id });
    }

    if (is_active !== undefined) {
      qb.andWhere('gi.is_active = :is_active', { is_active });
    }

    qb.orderBy('gi.name', 'ASC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((item) => this.mapGuideItem(item)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  // ── REHBEr İÇERİĞİ: OLUŞTUR ───────────────────────────────────────────

  async createGuideItem(dto: CreateGuideItemDto) {
    const category = await this.guideCategoryRepository.findOne({
      where: { id: dto.category_id },
    });
    if (!category) throw new BadRequestException('Kategori bulunamadı');

    const item = this.guideItemRepository.create({
      category_id: dto.category_id,
      name: dto.name,
      phone: dto.phone,
      address: dto.address,
      email: dto.email,
      website_url: dto.website_url,
      working_hours: dto.working_hours,
      latitude: dto.latitude,
      longitude: dto.longitude,
      logo_file_id: dto.logo_file_id,
      description: dto.description,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.guideItemRepository.save(item);

    const full = await this.guideItemRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'category.parent'],
    });

    return { item: this.mapGuideItem(full!) };
  }

  // ── REHBEr İÇERİĞİ: GÜNCELLE ─────────────────────────────────────────

  async updateGuideItem(id: string, dto: UpdateGuideItemDto) {
    const item = await this.guideItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('İçerik bulunamadı');

    if (dto.category_id !== undefined) {
      const category = await this.guideCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!category) throw new BadRequestException('Kategori bulunamadı');
    }

    const fields: (keyof UpdateGuideItemDto)[] = [
      'category_id', 'name', 'phone', 'address', 'email', 'website_url',
      'working_hours', 'latitude', 'longitude', 'logo_file_id', 'description', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (item as any)[field] = dto[field];
      }
    }

    await this.guideItemRepository.save(item);

    const updated = await this.guideItemRepository.findOne({
      where: { id },
      relations: ['category', 'category.parent'],
    });

    return { item: this.mapGuideItem(updated!) };
  }

  // ── REHBEr İÇERİĞİ: SİL ─────────────────────────────────────────────

  async deleteGuideItem(id: string) {
    const item = await this.guideItemRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException('İçerik bulunamadı');
    await this.guideItemRepository.delete(id);
  }

  // ── YARDIMCI: SLUG ÜRETİCİ ───────────────────────────────────────────

  private async generateGuideSlug(name: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await this.guideCategoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    return slug;
  }

  // ── YARDIMCI: KATEGORİ MAP ────────────────────────────────────────────

  private mapGuideCategory(cat: GuideCategory) {
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parent_id: cat.parent_id ?? null,
      parent: cat.parent
        ? { id: cat.parent.id, name: cat.parent.name }
        : null,
      children: cat.children
        ? cat.children.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: c.icon ?? null,
            color: c.color ?? null,
            display_order: c.display_order,
            is_active: c.is_active,
            created_at: c.created_at,
          }))
        : [],
      icon: cat.icon ?? null,
      color: cat.color ?? null,
      display_order: cat.display_order,
      is_active: cat.is_active,
      created_at: cat.created_at,
    };
  }

  // ── YARDIMCI: İÇERİK MAP ─────────────────────────────────────────────

  private mapGuideItem(item: GuideItem) {
    return {
      id: item.id,
      category_id: item.category_id,
      category: item.category
        ? {
            id: item.category.id,
            name: item.category.name,
            parent: item.category.parent
              ? { id: item.category.parent.id, name: item.category.parent.name }
              : null,
          }
        : null,
      name: item.name,
      phone: item.phone,
      address: item.address ?? null,
      email: item.email ?? null,
      website_url: item.website_url ?? null,
      working_hours: item.working_hours ?? null,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
      logo_file_id: item.logo_file_id ?? null,
      description: item.description ?? null,
      is_active: item.is_active,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }

  // ════════════════════════════════════════════════════════════════════════
  // MEKANLAR YÖNETİMİ (Places Admin)
  // ════════════════════════════════════════════════════════════════════════

  private mapPlace(place: Place) {
    return {
      id: place.id,
      category_id: place.category_id ?? null,
      category: place.category
        ? { id: place.category.id, name: place.category.name, icon: place.category.icon ?? null }
        : null,
      name: place.name,
      description: place.description ?? null,
      address: place.address ?? null,
      latitude: place.latitude,
      longitude: place.longitude,
      entrance_fee: place.entrance_fee ?? null,
      is_free: place.is_free,
      opening_hours: place.opening_hours ?? null,
      best_season: place.best_season ?? null,
      how_to_get_there: place.how_to_get_there ?? null,
      distance_from_center: place.distance_from_center ?? null,
      cover_image_id: place.cover_image_id ?? null,
      cover_image_url: (place.cover_image as any)?.url ?? null,
      is_active: place.is_active,
      images: place.images?.map((img) => ({
        id: img.id,
        file_id: img.file_id,
        url: (img.file as any)?.url ?? null,
        display_order: img.display_order,
      })) ?? [],
      created_at: place.created_at,
      updated_at: place.updated_at,
    };
  }

  private generatePlaceSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .trim();
  }

  // ── MEKAN KATEGORİLERİ: LİSTE ─────────────────────────────────────────

  async getPlaceCategories() {
    const categories = await this.placeCategoryRepository.find({
      order: { display_order: 'ASC', name: 'ASC' },
    });
    return { categories };
  }

  // ── MEKAN KATEGORİSİ: OLUŞTUR ─────────────────────────────────────────

  async createPlaceCategory(dto: CreatePlaceCategoryDto) {
    const baseSlug = this.generatePlaceSlug(dto.name);
    let slug = baseSlug;
    let counter = 1;

    while (await this.placeCategoryRepository.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const category = this.placeCategoryRepository.create({
      name: dto.name,
      slug,
      icon: dto.icon,
      display_order: dto.display_order ?? 0,
      is_active: dto.is_active ?? true,
    });

    const saved = await this.placeCategoryRepository.save(category);
    return { category: saved };
  }

  // ── MEKAN KATEGORİSİ: GÜNCELLE ────────────────────────────────────────

  async updatePlaceCategory(id: string, dto: UpdatePlaceCategoryDto) {
    const category = await this.placeCategoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    const fields: (keyof UpdatePlaceCategoryDto)[] = [
      'name', 'icon', 'display_order', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (category as any)[field] = dto[field];
      }
    }

    const saved = await this.placeCategoryRepository.save(category);
    return { category: saved };
  }

  // ── MEKAN KATEGORİSİ: SİL ─────────────────────────────────────────────

  async deletePlaceCategory(id: string) {
    const category = await this.placeCategoryRepository.findOne({
      where: { id },
      relations: ['places'],
    });
    if (!category) throw new NotFoundException('Kategori bulunamadı');

    if (category.places && category.places.length > 0) {
      throw new BadRequestException(
        'Mekan bulunan kategori silinemez. Önce mekanları silin veya taşıyın.',
      );
    }

    await this.placeCategoryRepository.delete(id);
  }

  // ── MEKANLAR: LİSTE ───────────────────────────────────────────────────

  async getAdminPlaces(dto: QueryAdminPlacesDto) {
    const { search, category_id, is_active, is_free, page = 1, limit = 20 } = dto;

    const qb = this.placeRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.cover_image', 'cover_image');

    if (search) {
      qb.andWhere(
        '(p.name ILIKE :search OR p.address ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category_id) {
      qb.andWhere('p.category_id = :category_id', { category_id });
    }

    if (is_active !== undefined) {
      qb.andWhere('p.is_active = :is_active', { is_active });
    }

    if (is_free !== undefined) {
      qb.andWhere('p.is_free = :is_free', { is_free });
    }

    qb.orderBy('p.name', 'ASC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [places, total] = await qb.getManyAndCount();

    return {
      places: places.map((p) => this.mapPlace(p)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  // ── MEKAN: DETAY ──────────────────────────────────────────────────────

  async getAdminPlace(id: string) {
    const place = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    if (!place) throw new NotFoundException('Mekan bulunamadı');

    return { place: this.mapPlace(place) };
  }

  // ── MEKAN: OLUŞTUR ────────────────────────────────────────────────────

  async createPlace(dto: CreatePlaceDto, userId: string) {
    if (dto.category_id) {
      const cat = await this.placeCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const place = this.placeRepository.create({
      category_id: dto.category_id,
      name: dto.name,
      description: dto.description,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      entrance_fee: dto.entrance_fee,
      is_free: dto.is_free ?? true,
      opening_hours: dto.opening_hours,
      best_season: dto.best_season,
      how_to_get_there: dto.how_to_get_there,
      distance_from_center: dto.distance_from_center,
      cover_image_id: dto.cover_image_id,
      is_active: dto.is_active ?? true,
      created_by: userId,
    });

    const saved = await this.placeRepository.save(place);

    const full = await this.placeRepository.findOne({
      where: { id: saved.id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(full!) };
  }

  // ── MEKAN: GÜNCELLE ───────────────────────────────────────────────────

  async updatePlace(id: string, dto: UpdatePlaceDto) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('Mekan bulunamadı');

    if (dto.category_id !== undefined && dto.category_id !== null) {
      const cat = await this.placeCategoryRepository.findOne({
        where: { id: dto.category_id },
      });
      if (!cat) throw new BadRequestException('Geçersiz kategori');
    }

    const fields: (keyof UpdatePlaceDto)[] = [
      'category_id', 'name', 'description', 'address', 'latitude', 'longitude',
      'entrance_fee', 'is_free', 'opening_hours', 'best_season',
      'how_to_get_there', 'distance_from_center', 'cover_image_id', 'is_active',
    ];

    for (const field of fields) {
      if (dto[field] !== undefined) {
        (place as any)[field] = dto[field];
      }
    }

    await this.placeRepository.save(place);

    const updated = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
  }

  // ── MEKAN: SİL ────────────────────────────────────────────────────────

  async deletePlace(id: string) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('Mekan bulunamadı');
    await this.placeRepository.delete(id);
  }

  // ── MEKAN FOTOĞRAFI: EKLE ─────────────────────────────────────────────

  async addPlaceImages(id: string, dto: AddPlaceImagesDto) {
    const place = await this.placeRepository.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!place) throw new NotFoundException('Mekan bulunamadı');

    const maxOrder =
      place.images?.reduce((max, img) => Math.max(max, img.display_order), -1) ?? -1;

    const newImages = dto.file_ids.map((file_id, idx) =>
      this.placeImageRepository.create({
        place_id: id,
        file_id,
        display_order: maxOrder + 1 + idx,
      }),
    );

    await this.placeImageRepository.save(newImages);

    const updated = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
  }

  // ── MEKAN FOTOĞRAFI: SİL ──────────────────────────────────────────────

  async deletePlaceImage(imageId: string) {
    const image = await this.placeImageRepository.findOne({
      where: { id: imageId },
      relations: ['place'],
    });
    if (!image) throw new NotFoundException('Fotoğraf bulunamadı');

    if (image.place?.cover_image_id === image.file_id) {
      await this.placeRepository.update(image.place_id, { cover_image_id: null as any });
    }

    await this.placeImageRepository.delete(imageId);
  }

  // ── MEKAN FOTOĞRAFI: KAPAK YAP ────────────────────────────────────────

  async setPlaceCoverImage(imageId: string) {
    const image = await this.placeImageRepository.findOne({
      where: { id: imageId },
    });
    if (!image) throw new NotFoundException('Fotoğraf bulunamadı');

    await this.placeRepository.update(image.place_id, {
      cover_image_id: image.file_id,
    });

    const updated = await this.placeRepository.findOne({
      where: { id: image.place_id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
  }

  // ── MEKAN FOTOĞRAFI: SIRALA ───────────────────────────────────────────

  async reorderPlaceImages(id: string, dto: ReorderPlaceImagesDto) {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('Mekan bulunamadı');

    await Promise.all(
      dto.ordered_ids.map((imageId, idx) =>
        this.placeImageRepository.update(imageId, { display_order: idx }),
      ),
    );

    const updated = await this.placeRepository.findOne({
      where: { id },
      relations: ['category', 'cover_image', 'images', 'images.file'],
    });

    return { place: this.mapPlace(updated!) };
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
