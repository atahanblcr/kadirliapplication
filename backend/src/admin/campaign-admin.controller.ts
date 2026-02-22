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
import { QueryAdminCampaignsDto } from './dto/query-admin-campaigns.dto';
import { AdminCreateCampaignDto } from './dto/admin-create-campaign.dto';
import { AdminUpdateCampaignDto } from './dto/admin-update-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class CampaignAdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/campaigns/businesses
  @Get('businesses')
  async getAdminBusinesses() {
    return this.adminService.getAdminBusinesses();
  }

  // GET /admin/campaigns
  @Get()
  async getAdminCampaigns(@Query() dto: QueryAdminCampaignsDto) {
    return this.adminService.getAdminCampaigns(dto);
  }

  // GET /admin/campaigns/:id
  @Get(':id')
  async getAdminCampaignDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getAdminCampaignDetail(id);
  }

  // POST /admin/campaigns
  @Post()
  async createAdminCampaign(
    @CurrentUser('id') adminId: string,
    @Body() dto: AdminCreateCampaignDto,
  ) {
    return this.adminService.createAdminCampaign(adminId, dto);
  }

  // PATCH /admin/campaigns/:id
  @Patch(':id')
  async updateAdminCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateCampaignDto,
  ) {
    return this.adminService.updateAdminCampaign(id, dto);
  }

  // DELETE /admin/campaigns/:id
  @Delete(':id')
  async deleteAdminCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteAdminCampaign(id);
  }
}
