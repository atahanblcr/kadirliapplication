import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { TaxiCall } from '../database/entities/taxi-call.entity';

@Injectable()
export class TaxiService {
  private readonly logger = new Logger(TaxiService.name);

  constructor(
    @InjectRepository(TaxiDriver)
    private readonly driverRepository: Repository<TaxiDriver>,
    @InjectRepository(TaxiCall)
    private readonly callRepository: Repository<TaxiCall>,
  ) {}

  // ── TAKSİ ŞOFÖR LİSTESİ ────────────────────────────────────────────────────
  // RANDOM sıralama - her istekte farklı sıra (ORDER BY RANDOM())
  // Sadece is_verified=true ve is_active=true olanlar

  async findAll() {
    const drivers = await this.driverRepository
      .createQueryBuilder('driver')
      .select([
        'driver.id',
        'driver.name',
        'driver.phone',
        'driver.plaka',
        'driver.vehicle_info',
        'driver.total_calls',
      ])
      .where('driver.is_verified = :verified', { verified: true })
      .andWhere('driver.is_active = :active', { active: true })
      .andWhere('driver.deleted_at IS NULL')
      .orderBy('RANDOM()')
      .getMany();

    return { drivers };
  }

  // ── TAKSİ ARA ──────────────────────────────────────────────────────────────
  // taxi_calls kaydı oluştur, total_calls++ yap

  async callDriver(passengerId: string, driverId: string) {
    // Şoförün varlığını ve aktifliğini kontrol et
    const driver = await this.driverRepository.findOne({
      where: {
        id: driverId,
        is_verified: true,
        is_active: true,
      },
    });

    if (!driver) {
      throw new NotFoundException('Taksi şoförü bulunamadı veya aktif değil');
    }

    // taxi_calls kaydı oluştur
    const call = this.callRepository.create({
      passenger_id: passengerId,
      driver_id: driverId,
    });
    await this.callRepository.save(call);

    // total_calls++ (atomic increment)
    await this.driverRepository
      .createQueryBuilder()
      .update(TaxiDriver)
      .set({ total_calls: () => 'total_calls + 1' })
      .where('id = :id', { id: driverId })
      .execute();

    this.logger.log(`Taksi çağrısı kaydedildi: şoför=${driverId}, yolcu=${passengerId}`);

    return {
      driver: {
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
      },
    };
  }
}
