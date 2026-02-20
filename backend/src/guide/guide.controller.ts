import { Controller, Get, Query } from '@nestjs/common';
import { GuideService } from './guide.service';
import { QueryGuideDto } from './dto/query-guide.dto';

@Controller('guide')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  // GET /guide/categories
  // ÖNEMLİ: GET /guide route'undan önce tanımlanmalı
  @Get('categories')
  async getCategories() {
    return this.guideService.findCategories();
  }

  // GET /guide?category_id=...&search=...
  // Rehber kayıtları (public)
  @Get()
  async findAll(@Query() dto: QueryGuideDto) {
    return this.guideService.findAll(dto);
  }
}
