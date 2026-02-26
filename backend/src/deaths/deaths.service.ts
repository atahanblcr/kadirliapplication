import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, DeepPartial, IsNull } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  DeathNotice,
  Cemetery,
  Mosque,
} from '../database/entities/death-notice.entity';
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

  // ── ADMIN: TÜM VEFAT İLANLARI ────────────────────────────────────────────

  async findAllAdmin(dto: { page?: number; limit?: number; status?: string; search?: string }) {
    const { page = 1, limit = 20, status, search } = dto;

    const qb = this.noticeRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.cemetery', 'cemetery')
      .leftJoinAndSelect('d.mosque', 'mosque')
      .leftJoinAndSelect('d.adder', 'adder')
      .leftJoinAndSelect('d.photo_file', 'photo_file')
      .where('d.deleted_at IS NULL');

    if (status) {
      qb.andWhere('d.status = :status', { status });
    }

    if (search) {
      qb.andWhere('d.deceased_name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('d.created_at', 'DESC')
      .skip(getPaginationOffset(page, limit))
      .take(limit);

    const [notices, total] = await qb.getManyAndCount();
    return { notices, meta: getPaginationMeta(total, page, limit) };
  }

  // ── ADMIN: ONAYLA ─────────────────────────────────────────────────────────

  async approveNotice(id: string, adminId: string) {
    const notice = await this.noticeRepository.findOne({
      where: { id, status: 'pending' },
    });
    if (!notice) {
      throw new NotFoundException('Vefat ilanı bulunamadı veya zaten işlenmiş');
    }
    await this.noticeRepository.update(id, {
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date(),
    });
    return { message: 'Vefat ilanı onaylandı' };
  }

  // ── ADMIN: REDDET ─────────────────────────────────────────────────────────

  async rejectNotice(id: string, reason: string, note?: string) {
    const notice = await this.noticeRepository.findOne({
      where: { id, status: 'pending' },
    });
    if (!notice) {
      throw new NotFoundException('Vefat ilanı bulunamadı veya zaten işlenmiş');
    }
    const fullReason = note ? `${reason} — ${note}` : reason;
    await this.noticeRepository.update(id, {
      status: 'rejected',
      rejected_reason: fullReason,
    });
    return { message: 'Vefat ilanı reddedildi' };
  }

  // ── ADMIN: SİL ────────────────────────────────────────────────────────────

  async adminDelete(id: string) {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException('Vefat ilanı bulunamadı');
    }
    await this.noticeRepository.softDelete(id);
    return { message: 'Vefat ilanı silindi' };
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
