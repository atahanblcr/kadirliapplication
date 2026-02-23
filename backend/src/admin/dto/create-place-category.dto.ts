import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlaceCategoryDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  display_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
