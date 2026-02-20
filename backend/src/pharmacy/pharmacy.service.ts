import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import { QueryScheduleDto } from './dto/query-schedule.dto';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(Pharmacy)
    private readonly pharmacyRepository: Repository<Pharmacy>,
    @InjectRepository(PharmacySchedule)
    private readonly scheduleRepository: Repository<PharmacySchedule>,
  ) {}

  // ── BUGÜNKÜ NÖBETÇİ ECZANE ────────────────────────────────────────────────
  // duty_date = CURRENT_DATE, birden fazla varsa ilkini döndür

  async getCurrent() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const schedule = await this.scheduleRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.pharmacy', 'pharmacy')
      .where('s.duty_date = :today', { today })
      .orderBy('s.created_at', 'ASC')
      .getOne();

    if (!schedule) {
      throw new NotFoundException('Bugün için nöbetçi eczane bulunamadı');
    }

    return {
      pharmacy: {
        id: schedule.pharmacy.id,
        name: schedule.pharmacy.name,
        address: schedule.pharmacy.address,
        phone: schedule.pharmacy.phone,
        latitude: schedule.pharmacy.latitude,
        longitude: schedule.pharmacy.longitude,
        duty_date: schedule.duty_date,
        duty_hours: `${schedule.start_time} - ${schedule.end_time}`,
        pharmacist_name: schedule.pharmacy.pharmacist_name,
      },
    };
  }

  // ── NÖBETÇİ TAKVİMİ ───────────────────────────────────────────────────────
  // Opsiyonel tarih aralığı filtresi

  async getSchedule(dto: QueryScheduleDto) {
    const qb = this.scheduleRepository
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.pharmacy', 'pharmacy')
      .orderBy('s.duty_date', 'ASC');

    if (dto.start_date) {
      qb.andWhere('s.duty_date >= :start_date', { start_date: dto.start_date });
    }

    if (dto.end_date) {
      qb.andWhere('s.duty_date <= :end_date', { end_date: dto.end_date });
    }

    const schedules = await qb.getMany();

    return {
      schedule: schedules.map((s) => ({
        date: s.duty_date,
        pharmacy: {
          id: s.pharmacy.id,
          name: s.pharmacy.name,
          phone: s.pharmacy.phone,
          address: s.pharmacy.address,
        },
      })),
    };
  }

  // ── TÜM ECZANELER ─────────────────────────────────────────────────────────

  async getList() {
    const pharmacies = await this.pharmacyRepository.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });

    return { pharmacies };
  }
}
