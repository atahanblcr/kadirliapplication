import { SetMetadata } from '@nestjs/common';
import { AdminModule } from '../../database/entities/admin-permission.entity';

export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'approve';

export interface PermissionRequirement {
  module: AdminModule;
  action: PermissionAction;
}

export const Permission = (module: AdminModule, action: PermissionAction) =>
  SetMetadata('permission', { module, action });
