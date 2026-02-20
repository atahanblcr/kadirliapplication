import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IntercityRoute,
      IntercitySchedule,
      IntracityRoute,
      IntracityStop,
    ]),
  ],
  controllers: [TransportController],
  providers: [TransportService],
})
export class TransportModule {}
