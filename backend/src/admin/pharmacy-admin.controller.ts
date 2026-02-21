import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { AssignScheduleDto } from './dto/assign-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class PharmacyAdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/pharmacy/schedule  (BEFORE :id to avoid routing conflict)
  @Get('schedule')
  async getAdminSchedule(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.adminService.getAdminSchedule(start_date, end_date);
  }

  // POST /admin/pharmacy/schedule
  @Post('schedule')
  async assignSchedule(@Body() dto: AssignScheduleDto) {
    return this.adminService.assignSchedule(dto);
  }

  // DELETE /admin/pharmacy/schedule/:id  (BEFORE :id to avoid routing conflict)
  @Delete('schedule/:id')
  async deleteScheduleEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteScheduleEntry(id);
  }

  // GET /admin/pharmacy
  @Get()
  async getAdminPharmacies() {
    return this.adminService.getAdminPharmacies();
  }

  // POST /admin/pharmacy
  @Post()
  async createPharmacy(@Body() dto: CreatePharmacyDto) {
    return this.adminService.createPharmacy(dto);
  }

  // PATCH /admin/pharmacy/:id
  @Patch(':id')
  async updatePharmacy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePharmacyDto,
  ) {
    return this.adminService.updatePharmacy(id, dto);
  }

  // DELETE /admin/pharmacy/:id
  @Delete(':id')
  async deletePharmacy(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deletePharmacy(id);
  }
}
