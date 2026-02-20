import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryApprovalsDto {
  @IsOptional()
  @IsEnum(['ad', 'death', 'campaign'])
  type?: 'ad' | 'death' | 'campaign';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
