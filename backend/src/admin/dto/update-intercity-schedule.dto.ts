import { PartialType } from '@nestjs/mapped-types';
import { CreateIntercityScheduleDto } from './create-intercity-schedule.dto';

export class UpdateIntercityScheduleDto extends PartialType(CreateIntercityScheduleDto) {}
