import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateTaxiDriverDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(15)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  plaka?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  vehicle_info?: string;

  @IsOptional()
  @IsUUID()
  registration_file_id?: string;

  @IsOptional()
  @IsUUID()
  license_file_id?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}
