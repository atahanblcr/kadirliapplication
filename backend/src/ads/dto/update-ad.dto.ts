import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateAdDto } from './create-ad.dto';

// image_ids ve cover_image_id güncelleme için ayrı opsiyonel
export class UpdateAdDto extends PartialType(
  OmitType(CreateAdDto, ['image_ids', 'cover_image_id'] as const),
) {}
