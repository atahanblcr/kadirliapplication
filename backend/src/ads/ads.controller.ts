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
  ParseUUIDPipe,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { QueryAdDto, QueryMyAdsDto } from './dto/query-ad.dto';
import { ExtendAdDto } from './dto/extend-ad.dto';

@Controller()
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  // ── PUBLIC ENDPOINTS ───────────────────────────────────────────────────────

  @Get('ads')
  async findAll(@Query() dto: QueryAdDto) {
    return this.adsService.findAll(dto);
  }

  @Get('ads/categories')
  async getCategories(@Query('parent_id') parentId?: string) {
    const categories = await this.adsService.findCategories(parentId);
    return { categories };
  }

  @Get('ads/categories/:id/properties')
  async getCategoryProperties(@Param('id', ParseUUIDPipe) id: string) {
    return this.adsService.findCategoryProperties(id);
  }

  @Get('ads/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const ad = await this.adsService.findOne(id);
    return { ad };
  }

  @Post('ads/:id/track-phone')
  async trackPhone(@Param('id', ParseUUIDPipe) id: string) {
    return this.adsService.trackPhoneClick(id);
  }

  @Post('ads/:id/track-whatsapp')
  async trackWhatsapp(@Param('id', ParseUUIDPipe) id: string) {
    return this.adsService.trackWhatsappClick(id);
  }

  // ── AUTHENTICATED ENDPOINTS ────────────────────────────────────────────────

  @Post('ads')
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: User, @Body() dto: CreateAdDto) {
    return this.adsService.create(user.id, dto);
  }

  @Patch('ads/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateAdDto,
  ) {
    const ad = await this.adsService.update(id, user.id, dto);
    return { ad };
  }

  @Delete('ads/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.adsService.remove(id, user.id);
  }

  @Post('ads/:id/extend')
  @UseGuards(JwtAuthGuard)
  async extend(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: ExtendAdDto,
  ) {
    return this.adsService.extend(id, user.id, dto);
  }

  @Post('ads/:id/favorite')
  @UseGuards(JwtAuthGuard)
  async addFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.adsService.addFavorite(id, user.id);
  }

  @Delete('ads/:id/favorite')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.adsService.removeFavorite(id, user.id);
  }

  // ── USER-SCOPED ENDPOINTS ──────────────────────────────────────────────────

  @Get('users/me/ads')
  @UseGuards(JwtAuthGuard)
  async findMyAds(@CurrentUser() user: User, @Query() dto: QueryMyAdsDto) {
    return this.adsService.findMyAds(user.id, dto);
  }

  @Get('users/me/favorites')
  @UseGuards(JwtAuthGuard)
  async findMyFavorites(@CurrentUser() user: User) {
    return this.adsService.findMyFavorites(user.id);
  }
}
