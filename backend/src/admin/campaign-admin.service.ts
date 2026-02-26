import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Campaign, CampaignImage } from '../database/entities/campaign.entity';
import { Business } from '../database/entities/business.entity';
import { BusinessCategory } from '../database/entities/business-category.entity';
import { FileEntity } from '../database/entities/file.entity';
import { QueryAdminCampaignsDto } from './dto/query-admin-campaigns.dto';
import { AdminCreateCampaignDto } from './dto/admin-create-campaign.dto';
import { AdminUpdateCampaignDto } from './dto/admin-update-campaign.dto';
import { RejectCampaignDto } from './dto/reject-campaign.dto';
import { CreateAdminBusinessDto } from './dto/create-admin-business.dto';
import { CreateBusinessCategoryDto } from './dto/create-business-category.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class CampaignAdminService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(BusinessCategory)
    private readonly businessCategoryRepository: Repository<BusinessCategory>,
    @InjectRepository(CampaignImage)
    private readonly campaignImageRepository: Repository<CampaignImage>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

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

  async deleteAdminCampaign(id: string) {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) throw new NotFoundException('Kampanya bulunamadı');
    await this.campaignRepository.softRemove(campaign);
    return { message: 'Kampanya silindi' };
  }

  async getAdminBusinesses() {
    const businesses = await this.businessRepository.find({
      select: ['id', 'business_name'],
      order: { business_name: 'ASC' },
    });
    return { businesses };
  }

  async createBusinessCategory(dto: CreateBusinessCategoryDto) {
    const slug = dto.name
      .toLowerCase()
      .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

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

  async createAdminCampaign(adminId: string, dto: AdminCreateCampaignDto) {
    const business = await this.businessRepository.findOne({
      where: { id: dto.business_id },
    });
    if (!business) throw new NotFoundException('İşletme bulunamadı');

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
}
