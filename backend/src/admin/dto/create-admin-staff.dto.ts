import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsPhoneNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../common/enums/user-role.enum';
import { AdminModule } from '../../database/entities/admin-permission.entity';

export class PermissionDto {
  @IsEnum(AdminModule)
  module: AdminModule;

  @IsOptional()
  can_read?: boolean;

  @IsOptional()
  can_create?: boolean;

  @IsOptional()
  can_update?: boolean;

  @IsOptional()
  can_delete?: boolean;

  @IsOptional()
  can_approve?: boolean;
}

export class CreateAdminStaffDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsPhoneNumber()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions?: PermissionDto[];
}
