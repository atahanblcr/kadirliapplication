import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { TaxiAdminService } from './taxi-admin.service';
import { CreateTaxiDriverDto } from './dto/create-taxi-driver.dto';
import { UpdateTaxiDriverDto } from './dto/update-taxi-driver.dto';
import { QueryTaxiDriversDto } from './dto/query-taxi-drivers.dto';

@Controller('admin/taxi')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class TaxiAdminController {
  constructor(private readonly taxiAdminService: TaxiAdminService) {}

  // ── LİSTE ─────────────────────────────────────────────────────────────────

  @Get()
  async getTaxiDrivers(@Query() dto: QueryTaxiDriversDto) {
    return this.taxiAdminService.getAdminTaxiDrivers(dto);
  }

  // ── DETAY ─────────────────────────────────────────────────────────────────

  @Get(':id')
  async getTaxiDriver(@Param('id', ParseUUIDPipe) id: string) {
    return this.taxiAdminService.getAdminTaxiDriver(id);
  }

  // ── OLUŞTUR ───────────────────────────────────────────────────────────────

  @Post()
  async createTaxiDriver(@Body() dto: CreateTaxiDriverDto) {
    return this.taxiAdminService.createTaxiDriver(dto);
  }

  // ── GÜNCELLE ──────────────────────────────────────────────────────────────

  @Patch(':id')
  async updateTaxiDriver(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaxiDriverDto,
  ) {
    return this.taxiAdminService.updateTaxiDriver(id, dto);
  }

  // ── SİL ───────────────────────────────────────────────────────────────────

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTaxiDriver(@Param('id', ParseUUIDPipe) id: string) {
    await this.taxiAdminService.deleteTaxiDriver(id);
  }
}
