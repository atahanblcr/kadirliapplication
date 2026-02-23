import { IsOptional, IsIn, IsString, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryComplaintsDto {
  @IsOptional()
  @IsIn(['pending', 'reviewing', 'resolved', 'rejected'])
  status?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: string;

  @IsOptional()
  @IsIn(['ad', 'announcement', 'campaign', 'user', 'death', 'other'])
  target_type?: string;

  @IsOptional()
  @IsUUID()
  reporter_id?: string;

  @IsOptional()
  @IsString()
  date_from?: string;

  @IsOptional()
  @IsString()
  date_to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
