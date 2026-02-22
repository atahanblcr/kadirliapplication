import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsIn,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNeighborhoodDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsIn(['neighborhood', 'village'])
  type: 'neighborhood' | 'village';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  population?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  display_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
