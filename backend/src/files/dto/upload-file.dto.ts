import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UploadFileDto {
  @IsEnum(['ad', 'announcement', 'death', 'event', 'campaign', 'place', 'taxi'])
  @IsNotEmpty({ message: 'Modül tipi boş olamaz' })
  module_type: 'ad' | 'announcement' | 'death' | 'event' | 'campaign' | 'place' | 'taxi';

  @IsOptional()
  @IsUUID()
  module_id?: string;
}
