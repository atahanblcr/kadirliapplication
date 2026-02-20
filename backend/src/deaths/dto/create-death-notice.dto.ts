import {
  IsString,
  IsInt,
  IsUUID,
  IsOptional,
  IsDateString,
  IsMilitaryTime,
  MaxLength,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';

export class CreateDeathNoticeDto {
  @IsString()
  @MaxLength(150, { message: 'İsim en fazla 150 karakter olabilir' })
  deceased_name: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number;

  @IsOptional()
  @IsUUID('4')
  photo_file_id?: string;

  @IsDateString({}, { message: 'Geçerli bir cenaze tarihi girin (YYYY-MM-DD)' })
  funeral_date: string;

  @IsMilitaryTime({ message: 'Geçerli bir saat girin (HH:mm)' })
  funeral_time: string;

  // En az biri zorunlu: cemetery_id veya mosque_id
  @IsOptional()
  @IsUUID('4')
  cemetery_id?: string;

  @IsOptional()
  @IsUUID('4')
  mosque_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  condolence_address?: string;
}
