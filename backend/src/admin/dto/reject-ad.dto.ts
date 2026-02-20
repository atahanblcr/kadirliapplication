import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RejectAdDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  rejected_reason: string;
}
