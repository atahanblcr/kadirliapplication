import {
  IsString,
  IsArray,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  ArrayMinSize,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntercityScheduleDto {
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'departure_time must be in HH:mm format (e.g. 08:00)',
  })
  departure_time: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(7, { each: true })
  @Type(() => Number)
  days_of_week: number[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
