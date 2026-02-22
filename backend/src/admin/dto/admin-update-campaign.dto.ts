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

export class AdminUpdateCampaignDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  discount_rate?: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @IsDateString()
  @IsOptional()
  valid_from?: string;

  @IsDateString()
  @IsOptional()
  valid_until?: string;

  @IsArray()
  @ArrayMaxSize(5)
  @IsUUID('4', { each: true })
  @IsOptional()
  image_ids?: string[];

  @IsUUID()
  @IsOptional()
  business_id?: string;
}
