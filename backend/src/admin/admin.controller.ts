import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { QueryApprovalsDto } from './dto/query-approvals.dto';
import { RejectAdDto } from './dto/reject-ad.dto';
import { QueryScraperLogsDto } from './dto/query-scraper-logs.dto';
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
