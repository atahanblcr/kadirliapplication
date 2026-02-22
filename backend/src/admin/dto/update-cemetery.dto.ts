import { PartialType } from '@nestjs/mapped-types';
import { CreateCemeteryDto } from './create-cemetery.dto';

export class UpdateCemeteryDto extends PartialType(CreateCemeteryDto) {}
