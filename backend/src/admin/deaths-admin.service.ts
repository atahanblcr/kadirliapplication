import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeathNotice, Cemetery, Mosque } from '../database/entities/death-notice.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { QueryDeathsDto } from './dto/query-deaths.dto';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathDto } from './dto/update-death.dto';
import { CreateCemeteryDto } from './dto/create-cemetery.dto';
import { UpdateCemeteryDto } from './dto/update-cemetery.dto';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class DeathsAdminService {
  constructor(
    @InjectRepository(DeathNotice)
    private readonly deathRepository: Repository<DeathNotice>,
    @InjectRepository(Cemetery)
    private readonly cemeteryRepository: Repository<Cemetery>,
    @InjectRepository(Mosque)
    private readonly mosqueRepository: Repository<Mosque>,
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
  ) {}

  async getAllDeaths(dto: QueryDeathsDto) {
    const page = parseInt(dto.page ?? '1', 10);
    const limit = parseInt(dto.limit ?? '20', 10);
    const skip = (page - 1) * limit;

    const qb = this.deathRepository
      .createQueryBuilder('d')
      .leftJoinAndSelect('d.cemetery', 'cemetery')
      .leftJoinAndSelect('d.mosque', 'mosque')
      .leftJoinAndSelect('d.neighborhood', 'neighborhood')
      .leftJoinAndSelect('d.photo_file', 'photo_file')
      .where('d.deleted_at IS NULL')
      .orderBy('d.funeral_date', 'DESC')
      .skip(skip)
      .take(limit);

    if (dto.search) {
      qb.andWhere('LOWER(d.deceased_name) LIKE :search', {
        search: `%${dto.search.toLowerCase()}%`,
      });
    }

    const [notices, total] = await qb.getManyAndCount();
    return { notices, meta: getPaginationMeta(total, page, limit) };
  }

  async createDeath(adminId: string, dto: CreateDeathDto) {
    const funeralDate = new Date(dto.funeral_date);
    const autoArchiveAt = new Date(funeralDate);
    autoArchiveAt.setDate(autoArchiveAt.getDate() + 7);

    const notice = this.deathRepository.create({
      deceased_name: dto.deceased_name,
      age: dto.age,
      funeral_date: dto.funeral_date,
      funeral_time: dto.funeral_time,
      cemetery_id: dto.cemetery_id,
      mosque_id: dto.mosque_id,
      condolence_address: dto.condolence_address,
      photo_file_id: dto.photo_file_id,
      neighborhood_id: dto.neighborhood_id,
      added_by: adminId,
      status: 'approved',
      approved_by: adminId,
      approved_at: new Date(),
      auto_archive_at: autoArchiveAt,
    });
    await this.deathRepository.save(notice);
    const saved = await this.deathRepository.findOne({
      where: { id: notice.id },
      relations: ['cemetery', 'mosque', 'neighborhood', 'photo_file'],
    });
    return { notice: saved };
  }

  async updateDeath(adminId: string, id: string, dto: UpdateDeathDto) {
    const notice = await this.deathRepository.findOne({ where: { id } });
    if (!notice) throw new NotFoundException('Vefat ilanı bulunamadı');

    if (dto.deceased_name !== undefined) notice.deceased_name = dto.deceased_name;
    if (dto.age !== undefined) notice.age = dto.age;
    if (dto.funeral_date !== undefined) {
      notice.funeral_date = dto.funeral_date;
      const funeralDate = new Date(dto.funeral_date);
      const autoArchiveAt = new Date(funeralDate);
      autoArchiveAt.setDate(autoArchiveAt.getDate() + 7);
      notice.auto_archive_at = autoArchiveAt;
    }
    if (dto.funeral_time !== undefined) notice.funeral_time = dto.funeral_time;
    if (dto.cemetery_id !== undefined) notice.cemetery_id = dto.cemetery_id;
    if (dto.mosque_id !== undefined) notice.mosque_id = dto.mosque_id;
    if (dto.condolence_address !== undefined) notice.condolence_address = dto.condolence_address;
    if (dto.photo_file_id !== undefined) notice.photo_file_id = dto.photo_file_id;
    if (dto.neighborhood_id !== undefined) notice.neighborhood_id = dto.neighborhood_id;

    await this.deathRepository.save(notice);
    const updated = await this.deathRepository.findOne({
      where: { id },
      relations: ['cemetery', 'mosque', 'neighborhood', 'photo_file'],
    });
    return { notice: updated };
  }

  async deleteDeath(id: string) {
    const notice = await this.deathRepository.findOne({ where: { id } });
    if (!notice) throw new NotFoundException('Vefat ilanı bulunamadı');
    await this.deathRepository.softDelete(id);
    return { success: true };
  }

  async getCemeteries() {
    const cemeteries = await this.cemeteryRepository.find({ order: { name: 'ASC' } });
    return { cemeteries };
  }

  async createCemetery(dto: CreateCemeteryDto) {
    const cemetery = this.cemeteryRepository.create(dto);
    await this.cemeteryRepository.save(cemetery);
    return { cemetery };
  }

  async updateCemetery(id: string, dto: UpdateCemeteryDto) {
    const cemetery = await this.cemeteryRepository.findOne({ where: { id } });
    if (!cemetery) throw new NotFoundException('Mezarlık bulunamadı');
    await this.cemeteryRepository.update(id, dto);
    return { cemetery: { ...cemetery, ...dto } };
  }

  async deleteCemetery(id: string) {
    const cemetery = await this.cemeteryRepository.findOne({ where: { id } });
    if (!cemetery) throw new NotFoundException('Mezarlık bulunamadı');
    await this.cemeteryRepository.remove(cemetery);
    return { message: 'Mezarlık silindi' };
  }

  async getMosques() {
    const mosques = await this.mosqueRepository.find({ order: { name: 'ASC' } });
    return { mosques };
  }

  async createMosque(dto: CreateMosqueDto) {
    const mosque = this.mosqueRepository.create(dto);
    await this.mosqueRepository.save(mosque);
    return { mosque };
  }

  async updateMosque(id: string, dto: UpdateMosqueDto) {
    const mosque = await this.mosqueRepository.findOne({ where: { id } });
    if (!mosque) throw new NotFoundException('Cami bulunamadı');
    await this.mosqueRepository.update(id, dto);
    return { mosque: { ...mosque, ...dto } };
  }

  async deleteMosque(id: string) {
    const mosque = await this.mosqueRepository.findOne({ where: { id } });
    if (!mosque) throw new NotFoundException('Cami bulunamadı');
    await this.mosqueRepository.remove(mosque);
    return { message: 'Cami silindi' };
  }

  async getDeathNeighborhoods() {
    const neighborhoods = await this.neighborhoodRepository.find({
      where: { is_active: true },
      order: { display_order: 'ASC', name: 'ASC' },
    });
    return { neighborhoods };
  }
}
