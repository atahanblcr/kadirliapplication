import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { QueryEventDto } from './dto/query-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // GET /events/categories
  // ÖNEMLİ: :id route'undan önce tanımlanmalı (route conflict önlemi)
  @Get('categories')
  async getCategories() {
    return this.eventsService.findCategories();
  }

  // GET /events?page=1&limit=20&category_id=...&city=...&is_free=true
  // Gelecekteki yayınlanmış etkinlikler (public)
  @Get()
  async findAll(@Query() dto: QueryEventDto) {
    return this.eventsService.findAll(dto);
  }

  // GET /events/:id
  // Etkinlik detayı (public)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.eventsService.findOne(id);
  }
}
