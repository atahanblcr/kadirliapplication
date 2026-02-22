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

export class CreateDeathDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  deceased_name: string;

  @IsNumber()
  @Min(1)
  @Max(150)
  @IsOptional()
  age?: number;

  @IsDateString()
  funeral_date: string; // 'YYYY-MM-DD'

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  funeral_time: string; // 'HH:mm'

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
