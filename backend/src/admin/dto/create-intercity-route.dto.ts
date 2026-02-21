import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  IsArray,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntercityRouteDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  company_name: string;

  @IsString()
  @MaxLength(100)
  from_city: string;

  @IsString()
  @MaxLength(100)
  to_city: string;

  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(1440)
  duration_minutes: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contact_phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  contact_website?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
