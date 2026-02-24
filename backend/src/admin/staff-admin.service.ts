import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/entities/user.entity';
import { AdminPermission, AdminModule } from '../database/entities/admin-permission.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateAdminStaffDto, PermissionDto } from './dto/create-admin-staff.dto';
import { UpdateAdminStaffDto } from './dto/update-admin-staff.dto';
import { UpdateAdminPermissionsDto } from './dto/update-admin-permissions.dto';
import { ResetStaffPasswordDto } from './dto/reset-staff-password.dto';
import { QueryStaffDto } from './dto/query-staff.dto';
import { getPaginationMeta } from '../common/utils/pagination.util';

@Injectable()
export class StaffAdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AdminPermission)
    private readonly permissionRepository: Repository<AdminPermission>,
  ) {}

  async getStaffList(requestingUserId: string, dto: QueryStaffDto) {
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // Only MOD/ADMIN/SUPER_ADMIN can list staff
    if (![UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(requestingUser.role)) {
      throw new ForbiddenException('Only admin staff can list staff members');
    }

    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const offset = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('u')
      .where('u.role IN (:...roles)', { roles: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN] });

    if (dto.search) {
      query.andWhere('(u.email ILIKE :search OR u.username ILIKE :search OR u.phone LIKE :search)', {
        search: `%${dto.search}%`,
      });
    }

    if (dto.role) {
      query.andWhere('u.role = :role', { role: dto.role });
    }

    if (typeof dto.is_active === 'boolean') {
      query.andWhere('u.is_active = :is_active', { is_active: dto.is_active });
    }

    query.orderBy('u.created_at', 'DESC')
      .skip(offset)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    // Get permissions for each staff
    const staffWithPermissions = await Promise.all(
      data.map(async (staff) => {
        const permissions = await this.permissionRepository.find({
          where: { user_id: staff.id },
        });
        return {
          ...staff,
          permissions,
          permission_count: permissions.length,
        };
      }),
    );

    return {
      data: staffWithPermissions,
      meta: getPaginationMeta(page, limit, total),
    };
  }

  async getStaffDetail(staffId: string) {
    const staff = await this.userRepository.findOne({
      where: {
        id: staffId,
        role: In([UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    const permissions = await this.permissionRepository.find({
      where: { user_id: staffId },
    });

    return {
      ...staff,
      permissions,
    };
  }

  async createStaff(requestingUserId: string, dto: CreateAdminStaffDto) {
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // Only SUPER_ADMIN can create staff
    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can create staff members');
    }

    // Only MODERATOR/ADMIN can be created (not SUPER_ADMIN)
    if (![UserRole.MODERATOR, UserRole.ADMIN].includes(dto.role)) {
      throw new BadRequestException('Only MODERATOR or ADMIN roles can be created');
    }

    // Check email/phone uniqueness
    const existingEmail = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already in use');
    }

    const existingPhone = await this.userRepository.findOne({
      where: { phone: dto.phone },
    });
    if (existingPhone) {
      throw new BadRequestException('Phone already in use');
    }

    const existingUsername = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException('Username already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const newStaff = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      username: dto.username,
      phone: dto.phone,
      role: dto.role,
      is_active: true,
    });

    const savedStaff = await this.userRepository.save(newStaff);

    // Add permissions if provided
    let permissions: AdminPermission[] = [];
    if (dto.permissions && dto.permissions.length > 0) {
      permissions = await this.upsertPermissions(savedStaff.id, dto.permissions);
    }

    return {
      ...savedStaff,
      permissions,
    };
  }

  async updateStaff(requestingUserId: string, targetId: string, dto: UpdateAdminStaffDto) {
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // Only SUPER_ADMIN can update staff
    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can update staff members');
    }

    const targetStaff = await this.userRepository.findOne({
      where: { id: targetId },
    });

    if (!targetStaff) {
      throw new NotFoundException('Staff member not found');
    }

    // Prevent downgrading SUPER_ADMIN to lower role
    if (targetStaff.role === UserRole.SUPER_ADMIN && dto.role && dto.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot downgrade SUPER_ADMIN role');
    }

    // Prevent creating new SUPER_ADMIN via update
    if (dto.role === UserRole.SUPER_ADMIN && targetStaff.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot promote to SUPER_ADMIN');
    }

    if (dto.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existingUsername && existingUsername.id !== targetId) {
        throw new BadRequestException('Username already in use');
      }
    }

    const updated = Object.assign(targetStaff, dto);
    const savedStaff = await this.userRepository.save(updated);

    const permissions = await this.permissionRepository.find({
      where: { user_id: targetId },
    });

    return {
      ...savedStaff,
      permissions,
    };
  }

  async updateStaffPermissions(requestingUserId: string, targetId: string, dto: UpdateAdminPermissionsDto) {
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // Only SUPER_ADMIN can update permissions
    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can update staff permissions');
    }

    const targetStaff = await this.userRepository.findOne({
      where: { id: targetId },
    });

    if (!targetStaff) {
      throw new NotFoundException('Staff member not found');
    }

    // Only update permissions for MODERATOR (ADMIN/SUPER_ADMIN have full access)
    if (targetStaff.role !== UserRole.MODERATOR) {
      throw new BadRequestException('Permissions can only be set for MODERATOR role');
    }

    return this.upsertPermissions(targetId, dto.permissions);
  }

  async deactivateStaff(requestingUserId: string, targetId: string) {
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // Only SUPER_ADMIN can deactivate staff
    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can deactivate staff members');
    }

    const targetStaff = await this.userRepository.findOne({
      where: { id: targetId },
    });

    if (!targetStaff) {
      throw new NotFoundException('Staff member not found');
    }

    // Cannot deactivate SUPER_ADMIN
    if (targetStaff.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot deactivate SUPER_ADMIN users');
    }

    targetStaff.is_active = false;
    const savedStaff = await this.userRepository.save(targetStaff);

    const permissions = await this.permissionRepository.find({
      where: { user_id: targetId },
    });

    return {
      ...savedStaff,
      permissions,
    };
  }

  async resetStaffPassword(requestingUserId: string, targetId: string, dto: ResetStaffPasswordDto) {
    const requestingUser = await this.userRepository.findOne({
      where: { id: requestingUserId },
    });

    if (!requestingUser) {
      throw new NotFoundException('Requesting user not found');
    }

    // Only SUPER_ADMIN can reset passwords
    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can reset staff passwords');
    }

    const targetStaff = await this.userRepository.findOne({
      where: { id: targetId },
    });

    if (!targetStaff) {
      throw new NotFoundException('Staff member not found');
    }

    const hashedPassword = await bcrypt.hash(dto.new_password, 10);

    await this.userRepository.update({ id: targetId }, { password: hashedPassword });

    const updated = await this.userRepository.findOne({
      where: { id: targetId },
    });

    const permissions = await this.permissionRepository.find({
      where: { user_id: targetId },
    });

    return {
      ...updated,
      permissions,
    };
  }

  private async upsertPermissions(userId: string, permissions: PermissionDto[]): Promise<AdminPermission[]> {
    // Delete existing permissions
    await this.permissionRepository.delete({ user_id: userId });

    // Create new permissions
    const newPermissions = permissions.map((perm) =>
      this.permissionRepository.create({
        user_id: userId,
        module: perm.module,
        can_read: perm.can_read || false,
        can_create: perm.can_create || false,
        can_update: perm.can_update || false,
        can_delete: perm.can_delete || false,
        can_approve: perm.can_approve || false,
      }),
    );

    return this.permissionRepository.save(newPermissions);
  }
}
