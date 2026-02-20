import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { QueryCampaignDto } from './dto/query-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../database/entities/user.entity';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // GET /campaigns?page=1&category_id=...&active_only=true
  // Aktif kampanyalar (public)
  @Get()
  async findAll(@Query() dto: QueryCampaignDto) {
    return this.campaignsService.findAll(dto);
  }

  // GET /campaigns/:id
  // Kampanya detayı (public)
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.campaignsService.findOne(id);
  }

  // POST /campaigns/:id/view-code
  // İndirim kodunu görüntüle + kayıt oluştur (auth)
  @Post(':id/view-code')
  @UseGuards(JwtAuthGuard)
  async viewCode(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.campaignsService.viewCode(user.id, id);
  }

  // POST /campaigns
  // Kampanya oluştur (auth, sadece business rolü)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS)
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.campaignsService.create(user.id, dto);
  }
}
