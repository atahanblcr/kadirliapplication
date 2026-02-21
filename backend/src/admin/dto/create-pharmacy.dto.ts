import {
  IsString, IsNotEmpty, IsOptional, IsNumber,
  MaxLength, IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePharmacyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  working_hours?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  pharmacist_name?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
