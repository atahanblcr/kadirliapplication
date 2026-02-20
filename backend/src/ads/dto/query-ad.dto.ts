import {
  IsOptional,
  IsUUID,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAdDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @IsOptional()
  @IsUUID('4')
  category_id?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_price?: number;

  @IsOptional()
  @IsString()
  @IsEnum(['-created_at', 'price', '-price', 'view_count'], {
    message: 'Sıralama: -created_at, price, -price veya view_count olmalıdır',
  })
  sort?: string = '-created_at';

  @IsOptional()
  @IsString()
  search?: string;
}

export class QueryMyAdsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  @IsEnum(['pending', 'approved', 'rejected', 'expired', 'sold'], {
    message: 'Durum: pending, approved, rejected, expired veya sold olmalıdır',
  })
  status?: string;
}
