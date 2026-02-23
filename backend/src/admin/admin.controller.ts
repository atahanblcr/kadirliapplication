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
  HttpCode,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { QueryApprovalsDto } from './dto/query-approvals.dto';
import { RejectAdDto } from './dto/reject-ad.dto';
import { QueryScraperLogsDto } from './dto/query-scraper-logs.dto';
import { QueryNeighborhoodsDto } from './dto/query-neighborhoods.dto';
import { CreateNeighborhoodDto } from './dto/create-neighborhood.dto';
import { UpdateNeighborhoodDto } from './dto/update-neighborhood.dto';
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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

  // GET /admin/dashboard/module-usage
  @Get('dashboard/module-usage')
  async getModuleUsage() {
    return this.adminService.getModuleUsage();
  }

  // GET /admin/dashboard/activities
  @Get('dashboard/activities')
  async getRecentActivities() {
    return this.adminService.getRecentActivities();
  }

  // GET /admin/approvals
  @Get('approvals')
  async getApprovals(@Query() dto: QueryApprovalsDto) {
    return this.adminService.getApprovals(dto);
  }

  // DELETE /admin/ads/:id
  @Delete('ads/:id')
  @HttpCode(204)
  async deleteAd(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteAdAsAdmin(id);
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

  // ── NEIGHBORHOOD CRUD ──────────────────────────────────────────────────────

  // GET /admin/neighborhoods
  @Get('neighborhoods')
  async getNeighborhoods(@Query() dto: QueryNeighborhoodsDto) {
    const page = parseInt(dto.page ?? '1', 10);
    const limit = parseInt(dto.limit ?? '50', 10);
    const is_active = dto.is_active !== undefined ? dto.is_active === 'true' : undefined;
    return this.adminService.getNeighborhoods(dto.search, dto.type, is_active, page, limit);
  }

  // POST /admin/neighborhoods
  @Post('neighborhoods')
  async createNeighborhood(@Body() dto: CreateNeighborhoodDto) {
    return this.adminService.createNeighborhood(dto);
  }

  // PATCH /admin/neighborhoods/:id
  @Patch('neighborhoods/:id')
  async updateNeighborhood(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateNeighborhoodDto,
  ) {
    return this.adminService.updateNeighborhood(id, dto);
  }

  // DELETE /admin/neighborhoods/:id
  @Delete('neighborhoods/:id')
  async deleteNeighborhood(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteNeighborhood(id);
  }

  // ── ADMIN PROFİL ──────────────────────────────────────────────────────────

  // GET /admin/profile
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.adminService.getAdminProfile(user.id);
  }

  // PATCH /admin/profile
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateAdminProfileDto,
  ) {
    return this.adminService.updateAdminProfile(user.id, dto);
  }

  // PATCH /admin/change-password
  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.adminService.changeAdminPassword(user.id, dto);
  }
}
