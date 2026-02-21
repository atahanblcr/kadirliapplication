import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class RejectCampaignDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  reason: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
