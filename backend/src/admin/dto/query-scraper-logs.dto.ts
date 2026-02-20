import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryScraperLogsDto {
  @IsOptional()
  @IsString()
  scraper_name?: string;

  @IsOptional()
  @IsEnum(['success', 'failed', 'partial'])
  status?: 'success' | 'failed' | 'partial';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
