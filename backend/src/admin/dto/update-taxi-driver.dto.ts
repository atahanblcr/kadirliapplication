import { PartialType } from '@nestjs/mapped-types';
import { CreateTaxiDriverDto } from './create-taxi-driver.dto';

export class UpdateTaxiDriverDto extends PartialType(CreateTaxiDriverDto) {}
