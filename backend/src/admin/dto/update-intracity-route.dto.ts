import { PartialType } from '@nestjs/mapped-types';
import { CreateIntracityRouteDto } from './create-intracity-route.dto';

export class UpdateIntracityRouteDto extends PartialType(CreateIntracityRouteDto) {}
