import { IsOptional, IsUUID, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryCampaignDto {
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
  @IsUUID()
  category_id?: string;

  // Varsayılan: true → aktif tarih aralığı filtresi uygular
  // false → süresi dolmuş kampanyaları da dahil eder
  @IsOptional()
  @Transform(({ value }) => value === 'false' || value === false ? false : true)
  @IsBoolean()
  active_only?: boolean;
}
