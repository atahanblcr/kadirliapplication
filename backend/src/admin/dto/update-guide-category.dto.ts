import { PartialType } from '@nestjs/mapped-types';
import { CreateGuideCategoryDto } from './create-guide-category.dto';

export class UpdateGuideCategoryDto extends PartialType(
  CreateGuideCategoryDto,
) {}
