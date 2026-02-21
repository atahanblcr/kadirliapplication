import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntracityRouteDto {
  @IsString()
  @MaxLength(20)
  line_number: string;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'color must be a valid hex color (e.g. #FF5733)',
  })
  color?: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'first_departure must be in HH:mm format',
  })
  first_departure: string;

  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'last_departure must be in HH:mm format',
  })
  last_departure: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(120)
  frequency_minutes: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fare: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
