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
import { CampaignAdminService } from './campaign-admin.service';
import { QueryAdminCampaignsDto } from './dto/query-admin-campaigns.dto';
import { AdminCreateCampaignDto } from './dto/admin-create-campaign.dto';
import { AdminUpdateCampaignDto } from './dto/admin-update-campaign.dto';
import { CreateAdminBusinessDto } from './dto/create-admin-business.dto';
import { CreateBusinessCategoryDto } from './dto/create-business-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class CampaignAdminController {
  constructor(private readonly campaignAdminService: CampaignAdminService) {}

  // GET /admin/campaigns/businesses
  @Get('businesses')
  async getAdminBusinesses() {
    return this.campaignAdminService.getAdminBusinesses();
  }

  // GET /admin/campaigns/businesses/categories
  @Get('businesses/categories')
  async getBusinessCategories() {
    return this.campaignAdminService.getBusinessCategories();
  }

  // POST /admin/campaigns/businesses/categories
  @Post('businesses/categories')
  async createBusinessCategory(@Body() dto: CreateBusinessCategoryDto) {
    return this.campaignAdminService.createBusinessCategory(dto);
  }

  // POST /admin/campaigns/businesses
  @Post('businesses')
  async createAdminBusiness(@Body() dto: CreateAdminBusinessDto) {
    return this.campaignAdminService.createAdminBusiness(dto);
  }

  // GET /admin/campaigns
  @Get()
  async getAdminCampaigns(@Query() dto: QueryAdminCampaignsDto) {
    return this.campaignAdminService.getAdminCampaigns(dto);
  }

  // GET /admin/campaigns/:id
  @Get(':id')
  async getAdminCampaignDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.campaignAdminService.getAdminCampaignDetail(id);
  }

  // POST /admin/campaigns
  @Post()
  async createAdminCampaign(
    @CurrentUser('id') adminId: string,
    @Body() dto: AdminCreateCampaignDto,
  ) {
    return this.campaignAdminService.createAdminCampaign(adminId, dto);
  }

  // PATCH /admin/campaigns/:id
  @Patch(':id')
  async updateAdminCampaign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateCampaignDto,
  ) {
    return this.campaignAdminService.updateAdminCampaign(id, dto);
  }

  // DELETE /admin/campaigns/:id
  @Delete(':id')
  async deleteAdminCampaign(@Param('id', ParseUUIDPipe) id: string) {
    return this.campaignAdminService.deleteAdminCampaign(id);
  }
}
