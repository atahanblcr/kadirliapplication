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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
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

}
