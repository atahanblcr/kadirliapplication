import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
  IsArray,
  ArrayMaxSize,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class AdminCreateCampaignDto {
  @IsUUID()
  @IsNotEmpty()
  business_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount_rate?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @IsDateString()
  @IsNotEmpty()
  valid_from: string;

  @IsDateString()
  @IsNotEmpty()
  valid_until: string;

  @IsArray()
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  @IsOptional()
  image_ids?: string[];
}
