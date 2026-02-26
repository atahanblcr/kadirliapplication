import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';
import { QueryUsersDto } from './dto/query-users.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';

@Injectable()
export class UsersAdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ad)
    private readonly adRepository: Repository<Ad>,
  ) {}

  async getUsers(dto: QueryUsersDto) {
    const { search, role, is_banned, neighborhood_id, page = 1, limit = 50 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.primary_neighborhood', 'neighborhood')
      .where('u.deleted_at IS NULL')
      .orderBy('u.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere(
        '(u.phone ILIKE :search OR u.username ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      qb.andWhere('u.role = :role', { role });
    }

    if (is_banned !== undefined) {
      qb.andWhere('u.is_banned = :is_banned', { is_banned });
    }

    if (neighborhood_id) {
      qb.andWhere('u.primary_neighborhood_id = :neighborhood_id', {
        neighborhood_id,
      });
    }

    const [users, total] = await qb.getManyAndCount();
    return { users, total, page, limit };
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['primary_neighborhood'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const total_ads = await this.adRepository.count({ where: { user_id: id } });

    return { ...user, stats: { total_ads } };
  }

  async unbanUser(adminId: string, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (!user.is_banned) {
      throw new BadRequestException('Kullanıcı zaten banlı değil');
    }

    await this.userRepository.update(userId, {
      is_banned: false,
      ban_reason: null as unknown as string,
      banned_at: null as unknown as Date,
      banned_by: null as unknown as string,
    });

    return { message: 'Ban kaldırıldı' };
  }

  async changeUserRole(adminId: string, userId: string, dto: ChangeRoleDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    await this.userRepository.update(userId, { role: dto.role });

    return { message: 'Rol güncellendi', role: dto.role };
  }

  async banUser(adminId: string, userId: string, dto: BanUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.is_banned) {
      throw new BadRequestException('Kullanıcı zaten banlanmış');
    }

    const bannedAt = new Date();
    await this.userRepository.update(userId, {
      is_banned: true,
      ban_reason: dto.ban_reason,
      banned_at: bannedAt,
      banned_by: adminId,
    });

    const banned_until = dto.duration_days
      ? new Date(bannedAt.getTime() + dto.duration_days * 24 * 60 * 60 * 1000)
      : null;

    return { message: 'Kullanıcı banlandı', banned_until };
  }
}
