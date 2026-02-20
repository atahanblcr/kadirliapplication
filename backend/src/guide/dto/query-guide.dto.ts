import { IsOptional, IsUUID, IsString, MaxLength } from 'class-validator';

export class QueryGuideDto {
  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
