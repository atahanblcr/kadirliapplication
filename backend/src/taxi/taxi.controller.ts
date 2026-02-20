import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TaxiService } from './taxi.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';

@Controller('taxi')
@UseGuards(JwtAuthGuard)
export class TaxiController {
  constructor(private readonly taxiService: TaxiService) {}

  // GET /taxi/drivers
  // Aktif ve onaylı şoförler (RANDOM sıralama)
  @Get('drivers')
  async findAll() {
    return this.taxiService.findAll();
  }

  // POST /taxi/drivers/:id/call
  // Taksi ara: taxi_calls kaydı oluştur, total_calls arttır
  @Post('drivers/:id/call')
  async callDriver(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) driverId: string,
  ) {
    return this.taxiService.callDriver(user.id, driverId);
  }
}
