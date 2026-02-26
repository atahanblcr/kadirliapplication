import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { QueryTaxiDriversDto } from './dto/query-taxi-drivers.dto';
import { CreateTaxiDriverDto } from './dto/create-taxi-driver.dto';
import { UpdateTaxiDriverDto } from './dto/update-taxi-driver.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class TaxiAdminService {
  constructor(
    @InjectRepository(TaxiDriver)
    private readonly taxiDriverRepository: Repository<TaxiDriver>,
  ) {}

  async getAdminTaxiDrivers(dto: QueryTaxiDriversDto) {
    const { search, is_active, is_verified, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    // 1) ID listesini RANDOM() ile al (ilişki yok, DISTINCT sorunu olmaz)
    const idQb = this.taxiDriverRepository
      .createQueryBuilder('t')
      .select('t.id', 'id')
      .where('t.deleted_at IS NULL')
      .orderBy('RANDOM()');

    if (search) {
      idQb.andWhere(
        '(t.name ILIKE :search OR t.phone ILIKE :search OR t.plaka ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (is_active !== undefined) {
      idQb.andWhere('t.is_active = :is_active', { is_active });
    }
    if (is_verified !== undefined) {
      idQb.andWhere('t.is_verified = :is_verified', { is_verified });
    }

    const allIds: { id: string }[] = await idQb.getRawMany();
    const total = allIds.length;
    const pagedIds = allIds.slice(skip, skip + limit).map((r) => r.id);

    // 2) ID'lere göre detaylı veri çek (ilişkilerle birlikte)
    let drivers: TaxiDriver[] = [];
    if (pagedIds.length > 0) {
      drivers = await this.taxiDriverRepository
        .createQueryBuilder('t')
        .leftJoinAndSelect('t.registration_file', 'registration_file')
        .whereInIds(pagedIds)
        .getMany();

      // RANDOM() sırasını koru
      const orderMap = new Map(pagedIds.map((id, idx) => [id, idx]));
      drivers.sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0));
    }

    return {
      drivers: drivers.map((d) => this.mapTaxiDriver(d)),
      meta: getPaginationMeta(total, page, limit),
    };
  }

  async getAdminTaxiDriver(id: string) {
    const driver = await this.taxiDriverRepository.findOne({
      where: { id },
      relations: ['registration_file', 'license_file'],
    });
    if (!driver) throw new NotFoundException('Taksi sürücüsü bulunamadı');
    return { driver: this.mapTaxiDriver(driver) };
  }

  async createTaxiDriver(dto: CreateTaxiDriverDto) {
    if (dto.plaka) {
      const existing = await this.taxiDriverRepository.findOne({
        where: { plaka: dto.plaka },
      });
      if (existing) {
        throw new BadRequestException('Bu plaka numarası zaten kayıtlı');
      }
    }

    const driver = this.taxiDriverRepository.create({
      name: dto.name,
      phone: dto.phone,
      plaka: dto.plaka,
      vehicle_info: dto.vehicle_info,
      registration_file_id: dto.registration_file_id,
      license_file_id: dto.license_file_id,
      is_active: dto.is_active ?? true,
      is_verified: dto.is_verified ?? true,
      user_id: null,
    });

    const saved = await this.taxiDriverRepository.save(driver);
    const full = await this.taxiDriverRepository.findOne({
      where: { id: saved.id },
      relations: ['registration_file', 'license_file'],
    });
    return { driver: this.mapTaxiDriver(full!) };
  }

  async updateTaxiDriver(id: string, dto: UpdateTaxiDriverDto) {
    const driver = await this.taxiDriverRepository.findOne({ where: { id } });
    if (!driver) throw new NotFoundException('Taksi sürücüsü bulunamadı');

    if (dto.plaka && dto.plaka !== driver.plaka) {
      const existing = await this.taxiDriverRepository.findOne({
        where: { plaka: dto.plaka },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException('Bu plaka numarası zaten kayıtlı');
      }
    }

    if (dto.name !== undefined) driver.name = dto.name;
    if (dto.phone !== undefined) driver.phone = dto.phone;
    if (dto.plaka !== undefined) driver.plaka = dto.plaka;
    if (dto.vehicle_info !== undefined) driver.vehicle_info = dto.vehicle_info;
    if (dto.registration_file_id !== undefined) driver.registration_file_id = dto.registration_file_id;
    if (dto.license_file_id !== undefined) driver.license_file_id = dto.license_file_id;
    if (dto.is_active !== undefined) driver.is_active = dto.is_active;
    if (dto.is_verified !== undefined) driver.is_verified = dto.is_verified;

    await this.taxiDriverRepository.save(driver);

    const updated = await this.taxiDriverRepository.findOne({
      where: { id },
      relations: ['registration_file', 'license_file'],
    });
    return { driver: this.mapTaxiDriver(updated!) };
  }

  async deleteTaxiDriver(id: string) {
    const driver = await this.taxiDriverRepository.findOne({ where: { id } });
    if (!driver) throw new NotFoundException('Taksi sürücüsü bulunamadı');
    await this.taxiDriverRepository.softDelete(id);
  }

  private mapTaxiDriver(d: TaxiDriver) {
    return {
      id: d.id,
      name: d.name,
      phone: d.phone,
      plaka: d.plaka ?? null,
      vehicle_info: d.vehicle_info ?? null,
      registration_file_id: d.registration_file_id ?? null,
      registration_file_url: (d as any).registration_file?.cdn_url ?? null,
      license_file_id: d.license_file_id ?? null,
      is_verified: d.is_verified,
      is_active: d.is_active,
      total_calls: d.total_calls,
      created_at: d.created_at,
      updated_at: d.updated_at,
    };
  }
}
