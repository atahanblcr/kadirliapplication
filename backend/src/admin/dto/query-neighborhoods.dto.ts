import { IsOptional, IsString, IsIn, IsBooleanString } from 'class-validator';

export class QueryNeighborhoodsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
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
