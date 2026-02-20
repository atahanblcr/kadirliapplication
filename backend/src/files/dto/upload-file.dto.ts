import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class UploadFileDto {
  @IsEnum(['ad', 'announcement', 'death', 'event', 'campaign', 'place'])
  module_type: 'ad' | 'announcement' | 'death' | 'event' | 'campaign' | 'place';

  @IsOptional()
  @IsUUID()
  module_id?: string;
}
