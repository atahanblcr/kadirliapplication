import { PartialType } from '@nestjs/mapped-types';
import { CreateIntercityRouteDto } from './create-intercity-route.dto';

export class UpdateIntercityRouteDto extends PartialType(CreateIntercityRouteDto) {}
