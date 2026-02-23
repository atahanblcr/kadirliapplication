import {
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsInt,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsDateString()
  event_date: string;

  @IsString()
  event_time: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  duration_minutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  venue_name?: string;

  @IsOptional()
  @IsString()
  venue_address?: string;

  // Şehir içi mi (true) yoksa şehir dışı mı (false)
  @IsOptional()
  @IsBoolean()
  is_local?: boolean;

  // Şehir dışı etkinlikler için şehir adı
  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  organizer?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  ticket_price?: number;

  @IsOptional()
  @IsBoolean()
  is_free?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  age_restriction?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  capacity?: number;

  @IsOptional()
  @IsString()
  website_url?: string;

  @IsOptional()
  @IsString()
  ticket_url?: string;

  @IsOptional()
  @IsUUID()
  cover_image_id?: string;

  @IsOptional()
  @IsIn(['draft', 'published', 'cancelled', 'archived'])
  status?: string;
}
