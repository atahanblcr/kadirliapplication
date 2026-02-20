import { Controller, Get, Query } from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';
import { QueryScheduleDto } from './dto/query-schedule.dto';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  // GET /pharmacy/current
  // Bugünkü nöbetçi eczane (Auth yok, public)
  @Get('current')
  async getCurrent() {
    return this.pharmacyService.getCurrent();
  }

  // GET /pharmacy/schedule?start_date=...&end_date=...
  // Nöbetçi takvimi (Auth yok, public)
  @Get('schedule')
  async getSchedule(@Query() dto: QueryScheduleDto) {
    return this.pharmacyService.getSchedule(dto);
  }

  // GET /pharmacy/list
  // Tüm aktif eczaneler (Auth yok, public)
  @Get('list')
  async getList() {
    return this.pharmacyService.getList();
  }
}
