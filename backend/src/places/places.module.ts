import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place, PlaceCategory, PlaceImage } from '../database/entities/place.entity';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Place, PlaceCategory, PlaceImage])],
  controllers: [PlacesController],
  providers: [PlacesService],
})
export class PlacesModule {}
