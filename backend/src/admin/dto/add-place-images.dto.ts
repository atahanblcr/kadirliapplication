import { ArrayMaxSize, IsArray, IsUUID } from 'class-validator';

export class AddPlaceImagesDto {
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMaxSize(10)
  file_ids: string[];
}
