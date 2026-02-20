import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAnnouncementDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @IsUUID('4')
  @IsOptional()
  type_id?: string;

  @IsEnum(['low', 'normal', 'high', 'emergency'])
  @IsOptional()
  priority?: 'low' | 'normal' | 'high' | 'emergency';

  // Mahalle slug'ına göre filtrele
  @IsString()
  @IsOptional()
  neighborhood?: string;
}
