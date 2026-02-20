import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationsDto {
  @IsOptional()
  @IsBoolean()
  announcements?: boolean;

  @IsOptional()
  @IsBoolean()
  deaths?: boolean;

  @IsOptional()
  @IsBoolean()
  pharmacy?: boolean;

  @IsOptional()
  @IsBoolean()
  events?: boolean;

  @IsOptional()
  @IsBoolean()
  ads?: boolean;

  @IsOptional()
  @IsBoolean()
  campaigns?: boolean;
}
