import { IsUUID, IsDateString, IsNotEmpty } from 'class-validator';

export class AssignScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  pharmacy_id: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // YYYY-MM-DD
}
