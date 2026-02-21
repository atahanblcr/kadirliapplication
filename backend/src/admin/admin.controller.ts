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
import { QueryApprovalsDto } from './dto/query-approvals.dto';
import { RejectAdDto } from './dto/reject-ad.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { QueryScraperLogsDto } from './dto/query-scraper-logs.dto';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import { UpdatePharmacyDto } from './dto/update-pharmacy.dto';
import { AssignScheduleDto } from './dto/assign-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/dashboard
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  // GET /admin/approvals
  @Get('approvals')
  async getApprovals(@Query() dto: QueryApprovalsDto) {
    return this.adminService.getApprovals(dto);
  }

  // POST /admin/ads/:id/approve
  @Post('ads/:id/approve')
  async approveAd(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.approveAd(adminId, id);
  }

  // POST /admin/ads/:id/reject
  @Post('ads/:id/reject')
  async rejectAd(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectAdDto,
  ) {
    return this.adminService.rejectAd(adminId, id, dto);
  }

  // GET /admin/users
  @Get('users')
  async getUsers(@Query() dto: QueryUsersDto) {
    return this.adminService.getUsers(dto);
  }

  // GET /admin/users/:id
  @Get('users/:id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getUser(id);
  }

  // POST /admin/users/:id/ban
  @Post('users/:id/ban')
  async banUser(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BanUserDto,
  ) {
    return this.adminService.banUser(adminId, id, dto);
  }

  // POST /admin/users/:id/unban
  @Post('users/:id/unban')
  async unbanUser(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.unbanUser(adminId, id);
  }

  // PATCH /admin/users/:id/role
  @Patch('users/:id/role')
  async changeUserRole(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.adminService.changeUserRole(adminId, id, dto);
  }

  // ── PHARMACY ─────────────────────────────────────────────────────────────

  // GET /admin/pharmacy/schedule  (BEFORE :id to avoid routing conflict)
  @Get('pharmacy/schedule')
  async getAdminSchedule(
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ) {
    return this.adminService.getAdminSchedule(start_date, end_date);
  }

  // POST /admin/pharmacy/schedule
  @Post('pharmacy/schedule')
  async assignSchedule(@Body() dto: AssignScheduleDto) {
    return this.adminService.assignSchedule(dto);
  }

  // DELETE /admin/pharmacy/schedule/:id  (BEFORE pharmacy/:id)
  @Delete('pharmacy/schedule/:id')
  async deleteScheduleEntry(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteScheduleEntry(id);
  }

  // GET /admin/pharmacy
  @Get('pharmacy')
  async getAdminPharmacies() {
    return this.adminService.getAdminPharmacies();
  }

  // POST /admin/pharmacy
  @Post('pharmacy')
  async createPharmacy(@Body() dto: CreatePharmacyDto) {
    return this.adminService.createPharmacy(dto);
  }

  // PATCH /admin/pharmacy/:id
  @Patch('pharmacy/:id')
  async updatePharmacy(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePharmacyDto,
  ) {
    return this.adminService.updatePharmacy(id, dto);
  }

  // DELETE /admin/pharmacy/:id
  @Delete('pharmacy/:id')
  async deletePharmacy(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deletePharmacy(id);
  }

  // GET /admin/scrapers/logs
  @Get('scrapers/logs')
  async getScraperLogs(@Query() dto: QueryScraperLogsDto) {
    return this.adminService.getScraperLogs(dto);
  }

  // POST /admin/scrapers/:name/run  (super_admin only)
  @Post('scrapers/:name/run')
  @Roles(UserRole.SUPER_ADMIN)
  async runScraper(@Param('name') name: string) {
    return this.adminService.runScraper(name);
  }
}
