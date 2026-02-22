import { IsOptional, IsString, IsIn, IsBooleanString } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryNeighborhoodsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsIn(['neighborhood', 'village'])
  type?: string;

  @IsOptional()
  @IsBooleanString()
  is_active?: string;

  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  limit?: string;
}
