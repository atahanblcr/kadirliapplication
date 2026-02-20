import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';
import { GuideService } from './guide.service';
import { GuideController } from './guide.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GuideCategory, GuideItem])],
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
