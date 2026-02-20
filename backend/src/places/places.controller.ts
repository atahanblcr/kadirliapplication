import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { QueryPlaceDto } from './dto/query-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  // GET /places?category_id=...&is_free=true&sort=distance&user_lat=...&user_lng=...
  // Mekan listesi (public)
  @Get()
  async findAll(@Query() dto: QueryPlaceDto) {
    return this.placesService.findAll(dto);
  }

  // GET /places/:id
  // Mekan detayı (public)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.placesService.findOne(id);
  }
}
