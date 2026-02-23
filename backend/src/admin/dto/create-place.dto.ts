import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlaceDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  entrance_fee?: number;

  @IsOptional()
  @IsBoolean()
  is_free?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  opening_hours?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  best_season?: string;

  @IsOptional()
  @IsString()
  how_to_get_there?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  distance_from_center?: number;

  @IsOptional()
  @IsUUID()
  cover_image_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
