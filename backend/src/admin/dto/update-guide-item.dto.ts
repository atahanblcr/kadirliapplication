import { PartialType } from '@nestjs/mapped-types';
import { CreateGuideItemDto } from './create-guide-item.dto';

export class UpdateGuideItemDto extends PartialType(CreateGuideItemDto) {}
