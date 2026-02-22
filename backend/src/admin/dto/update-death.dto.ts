import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  Min,
  Max,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateDeathDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsOptional()
  deceased_name?: string;

  @IsNumber()
  @Min(1)
  @Max(150)
  @IsOptional()
  age?: number;

  @IsDateString()
  @IsOptional()
  funeral_date?: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  @IsOptional()
  funeral_time?: string;

  @IsUUID()
  @IsOptional()
  cemetery_id?: string;

  @IsUUID()
  @IsOptional()
  mosque_id?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  condolence_address?: string;

  @IsUUID()
  @IsOptional()
  photo_file_id?: string;

  @IsUUID()
  @IsOptional()
  neighborhood_id?: string;
}
