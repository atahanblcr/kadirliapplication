import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UploadFileDto {
  @IsEnum(['ad', 'announcement', 'death', 'event', 'campaign', 'place'])
  @IsNotEmpty({ message: 'Modül tipi boş olamaz' })
  module_type: 'ad' | 'announcement' | 'death' | 'event' | 'campaign' | 'place';

  @IsOptional()
  @IsUUID()
  module_id?: string;
}
