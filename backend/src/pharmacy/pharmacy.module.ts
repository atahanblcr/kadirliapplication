import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import { PharmacyService } from './pharmacy.service';
import { PharmacyController } from './pharmacy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pharmacy, PharmacySchedule])],
  controllers: [PharmacyController],
  providers: [PharmacyService],
})
export class PharmacyModule {}
