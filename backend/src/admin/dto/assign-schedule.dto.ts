import { IsUUID, IsDateString, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class AssignScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  pharmacy_id: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'start_time must be HH:mm format' })
  start_time?: string; // HH:mm, default 19:00

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'end_time must be HH:mm format' })
  end_time?: string; // HH:mm, default 09:00
}
