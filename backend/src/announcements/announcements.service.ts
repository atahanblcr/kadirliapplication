import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, DeepPartial } from 'typeorm';
import { Announcement } from '../database/entities/announcement.entity';
import { AnnouncementType } from '../database/entities/announcement-type.entity';
import { User } from '../database/entities/user.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
import { getPaginationMeta, getPaginationOffset } from '../common/utils/pagination.util';

@Injectable()
export class AnnouncementsService {
  private readonly logger = new Logger(AnnouncementsService.name);

  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(AnnouncementType)
    private readonly typeRepository: Repository<AnnouncementType>,
  ) {}

  // ── DUYURU LİSTESİ (Kullanıcı) ──────────────────────────────────────────────

  async findAll(user: User, dto: QueryAnnouncementDto) {
    const { page = 1, limit = 20, type_id, priority } = dto;

    const qb = this.announcementRepository
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.type', 'type')
      .where('a.status = :status', { status: 'published' })
      .andWhere('(a.visible_until IS NULL OR a.visible_until > NOW())')
      // Hedefleme filtresi (CLAUDE.md: neighborhood array ile)
      .andWhere(
        new Brackets((inner) => {
          inner
            .where("a.target_type = 'all'")
            .orWhere(
              "a.target_type = 'neighborhoods' AND a.target_neighborhoods @> :nbSlug::jsonb",
              {
                nbSlug: JSON.stringify([
                  user.primary_neighborhood?.slug ?? '',
                ]),
              },
            )
            .orWhere(
              "a.target_type = 'users' AND a.target_user_ids @> :userId::jsonb",
              { userId: JSON.stringify([user.id]) },
            );
        }),
      );

    if (type_id) {
      qb.andWhere('a.type_id = :typeId', { typeId: type_id });
    }

    if (priority) {
      qb.andWhere('a.priority = :priority', { priority });
    }

    qb.orderBy('a.created_at', 'DESC')
      .skip(getPaginationOffset(page, limit))
      .take(limit);

    const [announcements, total] = await qb.getManyAndCount();

    return {
      announcements,
      meta: getPaginationMeta(total, page, limit),
    };
  }

  // ── DUYURU TİPLERİ ─────────────────────────────────────────────────────────

  async findTypes(): Promise<AnnouncementType[]> {
    return this.typeRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC' },
    });
  }

  // ── DUYURU DETAYI ────────────────────────────────────────────────────────────

  async findOne(id: string, _user: User): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id, status: 'published' },
      relations: ['type', 'pdf_file', 'creator'],
    });

    if (!announcement) {
      throw new NotFoundException('Duyuru bulunamadı');
    }

    // Görüntülenme sayısını artır
    await this.announcementRepository.increment({ id }, 'view_count', 1);

    return announcement;
  }

  // ── DUYURU OLUŞTUR (Admin) ───────────────────────────────────────────────────

  async create(userId: string, dto: CreateAnnouncementDto): Promise<{ announcement: Announcement; estimated_recipients: number }> {
    // Tip kontrolü
    const type = await this.typeRepository.findOne({
      where: { id: dto.type_id, is_active: true },
    });
    if (!type) {
      throw new BadRequestException('Geçersiz veya aktif olmayan duyuru tipi');
    }

    // Mahalle hedeflemesi varsa boş array kontrolü
    if (dto.target_type === 'neighborhoods' && (!dto.target_neighborhoods || dto.target_neighborhoods.length === 0)) {
      throw new BadRequestException('Mahalle hedeflemesi için en az bir mahalle seçilmeli');
    }

    // Kullanıcı hedeflemesi varsa boş array kontrolü
    if (dto.target_type === 'users' && (!dto.target_user_ids || dto.target_user_ids.length === 0)) {
      throw new BadRequestException('Kullanıcı hedeflemesi için en az bir kullanıcı seçilmeli');
    }

    // İş kuralı: Manuel duyuru → direkt published
    // Scraping duyuruları bu endpoint üzerinden gelmiyor (başka akış)
    const status = 'published';
    const sentAt = dto.scheduled_for ? null : new Date();

    const announcement = this.announcementRepository.create({
      ...dto,
      created_by: userId,
      status,
      sent_at: sentAt,
      has_pdf: !!dto.pdf_file_id,
      has_link: !!dto.external_link,
      scheduled_for: dto.scheduled_for ? new Date(dto.scheduled_for) : undefined,
      visible_until: dto.visible_until ? new Date(dto.visible_until) : undefined,
    } as DeepPartial<Announcement>);

    const saved = await this.announcementRepository.save(announcement);

    const estimated_recipients = await this.estimateRecipients(dto);

    this.logger.log(`Duyuru oluşturuldu: ${saved.id} (kullanıcı: ${userId})`);

    return { announcement: saved, estimated_recipients };
  }

  // ── DUYURU GÜNCELLE (Admin) ──────────────────────────────────────────────────

  async update(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException('Duyuru bulunamadı');
    }

    // Tip değişiyorsa kontrol et
    if (dto.type_id && dto.type_id !== announcement.type_id) {
      const type = await this.typeRepository.findOne({
        where: { id: dto.type_id, is_active: true },
      });
      if (!type) {
        throw new BadRequestException('Geçersiz duyuru tipi');
      }
    }

    const updated = this.announcementRepository.merge(announcement, {
      ...dto,
      has_pdf: dto.pdf_file_id !== undefined ? !!dto.pdf_file_id : announcement.has_pdf,
      has_link: dto.external_link !== undefined ? !!dto.external_link : announcement.has_link,
      scheduled_for: dto.scheduled_for ? new Date(dto.scheduled_for) : announcement.scheduled_for,
      visible_until: dto.visible_until ? new Date(dto.visible_until) : announcement.visible_until,
    } as DeepPartial<Announcement>);

    return this.announcementRepository.save(updated);
  }

  // ── DUYURU SİL (Admin) ───────────────────────────────────────────────────────

  async remove(id: string): Promise<{ message: string }> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException('Duyuru bulunamadı');
    }

    // Soft delete (deleted_at kolonu)
    await this.announcementRepository.softDelete(id);

    this.logger.log(`Duyuru silindi: ${id}`);

    return { message: 'Duyuru silindi' };
  }

  // ── HEMEN GÖNDER (Admin) ─────────────────────────────────────────────────────

  async send(id: string): Promise<{ message: string; estimated_recipients: number }> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
    });

    if (!announcement) {
      throw new NotFoundException('Duyuru bulunamadı');
    }

    if (announcement.sent_at) {
      throw new BadRequestException('Duyuru zaten gönderildi');
    }

    // Durumu published yap ve gönderim zamanını kaydet
    await this.announcementRepository.update(id, {
      status: 'published',
      sent_at: new Date(),
    });

    const estimated_recipients = await this.estimateRecipients({
      target_type: announcement.target_type,
      target_neighborhoods: announcement.target_neighborhoods,
      target_user_ids: announcement.target_user_ids,
    } as CreateAnnouncementDto);

    this.logger.log(`Duyuru gönderildi: ${id}, tahmini alıcı: ${estimated_recipients}`);

    return {
      message: 'Duyuru gönderiliyor',
      estimated_recipients,
    };
  }

  // ── YARDIMCI METODLAR ───────────────────────────────────────────────────────

  private async estimateRecipients(dto: Partial<CreateAnnouncementDto>): Promise<number> {
    // Basit tahmini sayım (gerçek push notification için kullanıcı sorgusu yapılacak)
    if (dto.target_type === 'all') {
      return 1000; // Placeholder: gerçek kullanıcı sayısına göre değişir
    }
    if (dto.target_type === 'neighborhoods' && dto.target_neighborhoods?.length) {
      return dto.target_neighborhoods.length * 200; // Mahalle başına ~200 kullanıcı
    }
    if (dto.target_type === 'users' && dto.target_user_ids?.length) {
      return dto.target_user_ids.length;
    }
    return 0;
  }
}
