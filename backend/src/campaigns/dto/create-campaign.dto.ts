import {
  IsString,
  IsOptional,
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
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsUUID('4', { each: true })
  image_ids: string[];

  @IsOptional()
  @IsUUID()
  cover_image_id?: string;
}
