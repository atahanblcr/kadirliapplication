import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class BanUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  ban_reason: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  duration_days?: number;
}
