import { IsArray, IsUUID } from 'class-validator';

export class ReorderPlaceImagesDto {
  @IsArray()
  @IsUUID('all', { each: true })
  ordered_ids: string[];
}
