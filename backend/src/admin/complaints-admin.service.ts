import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from '../database/entities/complaint.entity';
import { QueryComplaintsDto } from './dto/query-complaints.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class ComplaintsAdminService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
  ) {}

  async getComplaints(dto: QueryComplaintsDto) {
    const { status, priority, target_type, reporter_id, date_from, date_to, page = 1, limit = 20 } = dto;

    const qb = this.complaintRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'u')
      .leftJoinAndSelect('c.reviewer', 'rv')
      .leftJoinAndSelect('c.resolver', 'rs');

    if (status) {
      qb.andWhere('c.status = :status', { status });
    }
    if (priority) {
      qb.andWhere('c.priority = :priority', { priority });
    }
    if (target_type) {
      qb.andWhere('c.related_module = :target_type', { target_type });
    }
    if (reporter_id) {
      qb.andWhere('c.user_id = :reporter_id', { reporter_id });
    }
    if (date_from) {
      qb.andWhere('c.created_at >= :date_from', { date_from: new Date(date_from) });
    }
    if (date_to) {
      qb.andWhere('c.created_at <= :date_to', { date_to: new Date(date_to) });
    }

    qb.orderBy('c.created_at', 'DESC');

    const offset = (page - 1) * limit;
    qb.skip(offset).take(limit);

    const [rawItems, total] = await qb.getManyAndCount();

    // Urgent/High önce, sonra created_at DESC
    const priorityOrder: Record<string, number> = { urgent: 1, high: 2, medium: 3, low: 4 };
    const items = rawItems.sort((a, b) => {
      const pa = priorityOrder[a.priority] ?? 4;
      const pb = priorityOrder[b.priority] ?? 4;
      if (pa !== pb) return pa - pb;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return {
      complaints: items.map((c) => this.mapComplaint(c)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async getComplaintById(id: string) {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: ['user', 'reviewer', 'resolver'],
    });
    if (!complaint) throw new NotFoundException('Şikayet bulunamadı');
    return { complaint: this.mapComplaint(complaint) };
  }

  async reviewComplaint(id: string, adminId: string) {
    const complaint = await this.complaintRepository.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException('Şikayet bulunamadı');

    if (complaint.status !== 'pending') {
      throw new BadRequestException('Sadece bekleyen şikayetler incelemeye alınabilir');
    }

    await this.complaintRepository.update(id, {
      status: 'reviewing',
      reviewed_by: adminId,
      reviewed_at: new Date(),
    });

    const updated = await this.complaintRepository.findOne({
      where: { id },
      relations: ['user', 'reviewer', 'resolver'],
    });
    return { complaint: this.mapComplaint(updated!) };
  }

  async resolveComplaint(id: string, dto: UpdateComplaintStatusDto, adminId: string) {
    const complaint = await this.complaintRepository.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException('Şikayet bulunamadı');

    if (!['pending', 'reviewing'].includes(complaint.status)) {
      throw new BadRequestException('Bu şikayet zaten sonuçlandırılmış');
    }
    if (!dto.admin_response) {
      throw new BadRequestException('Admin yanıtı zorunludur');
    }

    const now = new Date();
    await this.complaintRepository.update(id, {
      status: 'resolved',
      admin_notes: dto.admin_response,
      resolved_by: adminId,
      resolved_at: now,
      ...(complaint.status === 'pending' ? { reviewed_by: adminId, reviewed_at: now } : {}),
    });

    const updated = await this.complaintRepository.findOne({
      where: { id },
      relations: ['user', 'reviewer', 'resolver'],
    });
    return { complaint: this.mapComplaint(updated!) };
  }

  async rejectComplaint(id: string, dto: UpdateComplaintStatusDto, adminId: string) {
    const complaint = await this.complaintRepository.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException('Şikayet bulunamadı');

    if (!['pending', 'reviewing'].includes(complaint.status)) {
      throw new BadRequestException('Bu şikayet zaten sonuçlandırılmış');
    }
    if (!dto.admin_response) {
      throw new BadRequestException('Ret sebebi zorunludur');
    }

    const now = new Date();
    await this.complaintRepository.update(id, {
      status: 'rejected',
      admin_notes: dto.admin_response,
      resolved_by: adminId,
      resolved_at: now,
      ...(complaint.status === 'pending' ? { reviewed_by: adminId, reviewed_at: now } : {}),
    });

    const updated = await this.complaintRepository.findOne({
      where: { id },
      relations: ['user', 'reviewer', 'resolver'],
    });
    return { complaint: this.mapComplaint(updated!) };
  }

  async updateComplaintPriority(id: string, priority: string) {
    const allowed = ['low', 'medium', 'high', 'urgent'];
    if (!allowed.includes(priority)) {
      throw new BadRequestException('Geçersiz öncelik değeri');
    }

    const complaint = await this.complaintRepository.findOne({ where: { id } });
    if (!complaint) throw new NotFoundException('Şikayet bulunamadı');

    await this.complaintRepository.update(id, { priority });

    const updated = await this.complaintRepository.findOne({
      where: { id },
      relations: ['user', 'reviewer', 'resolver'],
    });
    return { complaint: this.mapComplaint(updated!) };
  }

  private mapComplaint(c: Complaint) {
    return {
      id: c.id,
      type: c.type,
      target_type: c.related_module,
      target_id: c.related_id,
      subject: c.subject,
      message: c.message,
      reason: c.reason,
      priority: c.priority,
      evidence_file_ids: c.evidence_file_ids ?? [],
      status: c.status,
      admin_notes: c.admin_notes,
      reporter: c.user
        ? {
            id: c.user.id,
            full_name: (c.user as any).full_name,
            phone: (c.user as any).phone,
          }
        : null,
      reviewer: c.reviewer
        ? {
            id: c.reviewer.id,
            full_name: (c.reviewer as any).full_name,
          }
        : null,
      resolver: c.resolver
        ? {
            id: c.resolver.id,
            full_name: (c.resolver as any).full_name,
          }
        : null,
      reviewed_at: c.reviewed_at,
      resolved_at: c.resolved_at,
      created_at: c.created_at,
    };
  }
}
