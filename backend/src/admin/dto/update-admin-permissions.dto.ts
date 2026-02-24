import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from './create-admin-staff.dto';

export class UpdateAdminPermissionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
