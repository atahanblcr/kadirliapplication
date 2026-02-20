import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventImage } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventImage, EventCategory])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
