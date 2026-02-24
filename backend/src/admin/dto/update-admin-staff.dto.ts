import { IsOptional, IsString, IsEnum, MinLength, MaxLength, IsBoolean } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class UpdateAdminStaffDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
