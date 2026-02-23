import { IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateComplaintStatusDto {
  @IsIn(['reviewing', 'resolved', 'rejected'])
  status: string;

  @ValidateIf((o) => o.status === 'resolved' || o.status === 'rejected')
  @IsString()
  admin_response: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: string;
}
