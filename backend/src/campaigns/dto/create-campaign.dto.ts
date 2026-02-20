import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsDateString,
  IsUUID,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty({ message: 'Kampanya başlığı boş olamaz' })
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  discount_percentage?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  discount_code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  terms?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimum_amount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  stock_limit?: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Başlangıç tarihi boş olamaz' })
  start_date: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Bitiş tarihi boş olamaz' })
  end_date: string;

  @IsArray()
  @IsNotEmpty({ message: 'Fotoğraf listesi boş olamaz' })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsUUID('4', { each: true })
  image_ids: string[];

  @IsOptional()
  @IsUUID()
  cover_image_id?: string;
}
