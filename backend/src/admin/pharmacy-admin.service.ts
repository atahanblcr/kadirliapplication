import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { AssignScheduleDto } from './dto/assign-schedule.dto';

@Injectable()
export class PharmacyAdminService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
    @InjectRepository(PharmacySchedule)
    private readonly pharmacyScheduleRepository: Repository<PharmacySchedule>,
  ) {}

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

  async createPharmacy(dto: CreatePharmacyDto) {
    const pharmacy = this.pharmacyRepository.create(dto);
    await this.pharmacyRepository.save(pharmacy);
    return { pharmacy };
  }

  async updatePharmacy(id: string, dto: UpdatePharmacyDto) {
    const pharmacy = await this.pharmacyRepository.findOne({ where: { id } });
    if (!pharmacy) throw new NotFoundException('Eczane bulunamadı');
    await this.pharmacyRepository.update(id, dto);
    return { pharmacy: { ...pharmacy, ...dto } };
  }

  async deletePharmacy(id: string) {
    const pharmacy = await this.pharmacyRepository.findOne({ where: { id } });
    if (!pharmacy) throw new NotFoundException('Eczane bulunamadı');
    await this.pharmacyRepository.remove(pharmacy);
    return { message: 'Eczane silindi' };
  }

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

  async assignSchedule(dto: AssignScheduleDto) {
    const pharmacy = await this.pharmacyRepository.findOne({
      where: { id: dto.pharmacy_id },
    });
    if (!pharmacy) throw new NotFoundException('Eczane bulunamadı');

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

  async deleteScheduleEntry(id: string) {
    const schedule = await this.pharmacyScheduleRepository.findOne({
      where: { id },
    });
    if (!schedule) throw new NotFoundException('Nöbet kaydı bulunamadı');
    await this.pharmacyScheduleRepository.remove(schedule);
    return { message: 'Nöbet silindi' };
  }
}
