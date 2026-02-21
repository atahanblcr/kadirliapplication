import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class RejectDeathNoticeDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  note?: string;
}
