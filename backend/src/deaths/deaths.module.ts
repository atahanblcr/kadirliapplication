import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeathsService } from './deaths.service';
import { DeathsController } from './deaths.controller';
import {
  DeathNotice,
  Cemetery,
  Mosque,
} from '../database/entities/death-notice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeathNotice, Cemetery, Mosque])],
  controllers: [DeathsController],
  providers: [DeathsService],
  exports: [DeathsService],
})
export class DeathsModule {}
