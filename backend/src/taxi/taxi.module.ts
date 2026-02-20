import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { TaxiCall } from '../database/entities/taxi-call.entity';
import { TaxiService } from './taxi.service';
import { TaxiController } from './taxi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TaxiDriver, TaxiCall])],
  controllers: [TaxiController],
  providers: [TaxiService],
})
export class TaxiModule {}
