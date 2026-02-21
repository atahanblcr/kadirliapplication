import { PartialType } from '@nestjs/mapped-types';
import { CreateIntracityStopDto } from './create-intracity-stop.dto';

export class UpdateIntracityStopDto extends PartialType(CreateIntracityStopDto) {}
