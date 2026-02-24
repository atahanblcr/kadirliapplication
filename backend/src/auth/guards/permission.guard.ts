import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { AdminPermission } from '../../database/entities/admin-permission.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { PermissionRequirement } from '../../common/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(AdminPermission)
    private permissionRepository: Repository<AdminPermission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirement = this.reflector.get<PermissionRequirement | undefined>(
      'permission',
      context.getHandler(),
    );

    // If no permission requirement, allow access
    if (!requirement) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as any;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // SUPER_ADMIN and ADMIN bypass permission checks
    if ([UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(user.role)) {
      return true;
    }

    // For MODERATOR, check admin_permissions table
    if (user.role === UserRole.MODERATOR) {
      const permission = await this.permissionRepository.findOne({
        where: {
          user_id: user.user_id,
          module: requirement.module,
        },
      });

      if (!permission) {
        throw new ForbiddenException('No permission for this module');
      }

      // Check the specific action
      const actionField = `can_${requirement.action}` as keyof AdminPermission;
      if (!permission[actionField]) {
        throw new ForbiddenException(`No ${requirement.action} permission for this module`);
      }

      return true;
    }

    // Other roles don't have access
    throw new ForbiddenException('Insufficient permissions');
  }
}
