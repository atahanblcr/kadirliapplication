import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, DeepPartial } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  DeathNotice,
  Cemetery,
  Mosque,
} from '../database/entities/death-notice.entity';
import { CreateDeathNoticeDto } from './dto/create-death-notice.dto';
import { QueryDeathNoticeDto } from './dto/query-death-notice.dto';
import { getPaginationMeta, getPaginationOffset } from '../common/utils/pagination.util';

@Injectable()
export class DeathsService {
  private readonly logger = new Logger(DeathsService.name);

  constructor(
    @InjectRepository(DeathNotice)
    private readonly noticeRepository: Repository<DeathNotice>,
    @InjectRepository(Cemetery)
    private readonly cemeteryRepository: Repository<Cemetery>,
    @InjectRepository(Mosque)
    private readonly mosqueRepository: Repository<Mosque>,
  ) {}

  // ── VEFAT İLANI LİSTESİ ───────────────────────────────────────────────────

  async findAll(dto: QueryDeathNoticeDto) {
    const { page = 1, limit = 20, funeral_date } = dto;

    const qb = this.noticeRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.cemetery', 'cemetery')
      .leftJoinAndSelect('d.mosque', 'mosque')
      .leftJoinAndSelect('d.photo_file', 'photo')
      .where('d.status = :status', { status: 'approved' });

    if (funeral_date) {
      qb.andWhere('d.funeral_date = :funeralDate', { funeralDate: funeral_date });
    }

    qb.orderBy('d.funeral_date', 'DESC')
      .addOrderBy('d.funeral_time', 'DESC')
      .skip(getPaginationOffset(page, limit))
      .take(limit);

    const [notices, total] = await qb.getManyAndCount();

    return { notices, meta: getPaginationMeta(total, page, limit) };
  }

  // ── VEFAT İLANI DETAYI ────────────────────────────────────────────────────

  async findOne(id: string) {
    const notice = await this.noticeRepository.findOne({
      where: { id, status: 'approved' },
      relations: ['cemetery', 'mosque', 'photo_file'],
    });

    if (!notice) {
      throw new NotFoundException('Vefat ilanı bulunamadı');
    }

    return notice;
  }

  // ── VEFAT İLANI OLUŞTUR ───────────────────────────────────────────────────

  async create(userId: string, dto: CreateDeathNoticeDto) {
    // En az biri zorunlu: cemetery_id veya mosque_id
    if (!dto.cemetery_id && !dto.mosque_id) {
      throw new BadRequestException('Mezarlık veya cami bilgisinden en az biri girilmelidir');
    }

    // Günlük limit kontrolü (2 vefat ilanı/gün)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyCount = await this.noticeRepository
      .createQueryBuilder('d')
      .where('d.added_by = :userId', { userId })
      .andWhere('d.created_at >= :today', { today })
      .getCount();

    if (dailyCount >= 2) {
      throw new BadRequestException('Günlük vefat ilanı limitine ulaştınız (maksimum 2)');
    }

    // Mezarlık kontrolü
    if (dto.cemetery_id) {
      const cemetery = await this.cemeteryRepository.findOne({
        where: { id: dto.cemetery_id, is_active: true },
      });
      if (!cemetery) {
        throw new BadRequestException('Seçilen mezarlık bulunamadı');
      }
    }

    // Cami kontrolü
    if (dto.mosque_id) {
      const mosque = await this.mosqueRepository.findOne({
        where: { id: dto.mosque_id, is_active: true },
      });
      if (!mosque) {
        throw new BadRequestException('Seçilen cami bulunamadı');
      }
    }

    // auto_archive_at = funeral_date + 7 gün (CLAUDE.md iş kuralı)
    const funeralDate = new Date(dto.funeral_date);
    const autoArchiveAt = new Date(funeralDate);
    autoArchiveAt.setDate(autoArchiveAt.getDate() + 7);

    const notice = this.noticeRepository.create({
      deceased_name: dto.deceased_name,
      age: dto.age,
      photo_file_id: dto.photo_file_id,
      funeral_date: dto.funeral_date,
      funeral_time: dto.funeral_time,
      cemetery_id: dto.cemetery_id,
      mosque_id: dto.mosque_id,
      condolence_address: dto.condolence_address,
      added_by: userId,
      status: 'pending',
      auto_archive_at: autoArchiveAt,
    } as DeepPartial<DeathNotice>);

    const saved = await this.noticeRepository.save(notice);

    this.logger.log(`Vefat ilanı oluşturuldu: ${saved.id} (kullanıcı: ${userId})`);

    return {
      notice: {
        id: saved.id,
        status: saved.status,
        auto_archive_at: saved.auto_archive_at,
        message: 'Vefat ilanınız incelemeye alındı. Kısa sürede onaylanacak.',
      },
    };
  }

  // ── MEZARLIKLAR ────────────────────────────────────────────────────────────

  async findCemeteries() {
    return this.cemeteryRepository.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  // ── CAMİLER ────────────────────────────────────────────────────────────────

  async findMosques() {
    return this.mosqueRepository.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  // ── OTOMATİK ARŞİVLEME CRON JOB ──────────────────────────────────────────
  // Her gün gece 03:00'te çalışır
  // auto_archive_at <= NOW() olan ilanları soft delete yapar (CLAUDE.md iş kuralı)

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleAutoArchive() {
    const now = new Date();

    const result = await this.noticeRepository
      .createQueryBuilder()
      .softDelete()
      .where('auto_archive_at <= :now', { now })
      .andWhere('deleted_at IS NULL')
      .execute();

    const affected = result.affected ?? 0;
    if (affected > 0) {
      this.logger.log(`Otomatik arşivleme: ${affected} vefat ilanı arşivlendi`);
    }
  }
}
