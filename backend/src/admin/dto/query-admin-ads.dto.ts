import { IsOptional, IsString, IsIn, IsNumberString } from 'class-validator';

export class QueryAdminAdsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['pending', 'approved', 'rejected', 'expired', 'sold'])
  status?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}
