import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Campaign,
  CampaignImage,
  CampaignCodeView,
} from '../database/entities/campaign.entity';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import {
  getPaginationMeta,
  getPaginationOffset,
} from '../common/utils/pagination.util';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(CampaignImage)
    private readonly campaignImageRepository: Repository<CampaignImage>,
    @InjectRepository(CampaignCodeView)
    private readonly codeViewRepository: Repository<CampaignCodeView>,
  ) {}

  // ── KAMPANYA LİSTESİ ──────────────────────────────────────────────────────
  // Varsayılan: status=approved, aktif tarih aralığı

  async findAll(dto: QueryCampaignDto) {
    const { page = 1, limit = 20, category_id, active_only = true } = dto;
    const today = new Date().toISOString().slice(0, 10);

    const qb = this.campaignRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.business', 'business')
      .leftJoinAndSelect('business.category', 'business_category')
      .leftJoinAndSelect('c.cover_image', 'cover_image')
      .where('c.status = :status', { status: 'approved' })
      .andWhere('c.deleted_at IS NULL');

    // Aktif tarih aralığı filtresi
    if (active_only !== false) {
      qb.andWhere('c.start_date <= :today', { today })
        .andWhere('c.end_date >= :today', { today });
    }

    if (category_id) {
      qb.andWhere('business.category_id = :category_id', { category_id });
    }

    qb.orderBy('c.created_at', 'DESC')
      .skip(getPaginationOffset(page, limit))
      .take(limit);

    const [campaigns, total] = await qb.getManyAndCount();

    return { campaigns, meta: getPaginationMeta(total, page, limit) };
  }

  // ── KAMPANYA DETAYI ───────────────────────────────────────────────────────

  async findOne(id: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id, status: 'approved' },
      relations: [
        'business',
        'business.category',
        'cover_image',
        'images',
        'images.file',
      ],
    });

    if (!campaign) {
      throw new NotFoundException('Kampanya bulunamadı');
    }

    return { campaign };
  }

  // ── İNDİRİM KODU GÖRÜNTÜLE ────────────────────────────────────────────────
  // campaign_code_views kaydı oluştur, code_view_count++ (atomik)

  async viewCode(userId: string, campaignId: string) {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId, status: 'approved' },
      select: ['id', 'discount_code', 'terms'],
    });

    if (!campaign) {
      throw new NotFoundException('Kampanya bulunamadı');
    }

    // Görüntüleme kaydı oluştur
    const view = this.codeViewRepository.create({
      campaign_id: campaignId,
      user_id: userId,
    });
    await this.codeViewRepository.save(view);

    // code_view_count atomik artış
    await this.campaignRepository
      .createQueryBuilder()
      .update(Campaign)
      .set({ code_view_count: () => 'code_view_count + 1' })
      .where('id = :id', { id: campaignId })
      .execute();

    this.logger.log(`Kampanya kodu görüntülendi: kampanya=${campaignId}, kullanıcı=${userId}`);

    return {
      discount_code: campaign.discount_code,
      terms: campaign.terms,
    };
  }

  // ── KAMPANYA OLUŞTUR (Business) ───────────────────────────────────────────
}
