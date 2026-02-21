import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { QueryAdminCampaignsDto } from './dto/query-admin-campaigns.dto';
import { RejectCampaignDto } from './dto/reject-campaign.dto';
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

  // GET /admin/campaigns
  @Get()
  async getAdminCampaigns(@Query() dto: QueryAdminCampaignsDto) {
    return this.adminService.getAdminCampaigns(dto);
  }

  // POST /admin/campaigns/:id/approve
  @Post(':id/approve')
  async approveCampaign(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.adminService.approveCampaign(adminId, id);
  }

  // POST /admin/campaigns/:id/reject
  @Post(':id/reject')
  async rejectCampaign(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectCampaignDto,
  ) {
    return this.adminService.rejectCampaign(adminId, id, dto);
  }

  // DELETE /admin/campaigns/:id
  @Delete(':id')
  async deleteAdminCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteAdminCampaign(id);
  }
}
