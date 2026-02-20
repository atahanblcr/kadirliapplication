import { IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QueryNotificationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  unread_only?: boolean;
}
