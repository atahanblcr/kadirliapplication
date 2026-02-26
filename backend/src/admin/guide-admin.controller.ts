import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GuideAdminService } from './guide-admin.service';
import { CreateGuideCategoryDto } from './dto/create-guide-category.dto';
import { UpdateGuideCategoryDto } from './dto/update-guide-category.dto';
import { CreateGuideItemDto } from './dto/create-guide-item.dto';
import { UpdateGuideItemDto } from './dto/update-guide-item.dto';
import { QueryGuideItemsDto } from './dto/query-guide-items.dto';

@Controller('admin/guide')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class GuideAdminController {
  constructor(private readonly guideAdminService: GuideAdminService) {}

  // ── KATEGORİLER ──────────────────────────────────────────────────────────

  // GET /admin/guide/categories
  @Get('categories')
  getGuideCategories() {
    return this.guideAdminService.getGuideCategories();
  }

  // POST /admin/guide/categories
  @Post('categories')
  createGuideCategory(@Body() dto: CreateGuideCategoryDto) {
    return this.guideAdminService.createGuideCategory(dto);
  }

  // PATCH /admin/guide/categories/:id
  @Patch('categories/:id')
  updateGuideCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGuideCategoryDto,
  ) {
    return this.guideAdminService.updateGuideCategory(id, dto);
  }

  // DELETE /admin/guide/categories/:id
  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGuideCategory(@Param('id', ParseUUIDPipe) id: string) {
    await this.guideAdminService.deleteGuideCategory(id);
  }

  // ── İÇERİKLER ────────────────────────────────────────────────────────────

  // GET /admin/guide/items
  @Get('items')
  getGuideItems(@Query() dto: QueryGuideItemsDto) {
    return this.guideAdminService.getGuideItems(dto);
  }

  // POST /admin/guide/items
  @Post('items')
  createGuideItem(@Body() dto: CreateGuideItemDto) {
    return this.guideAdminService.createGuideItem(dto);
  }

  // PATCH /admin/guide/items/:id
  @Patch('items/:id')
  updateGuideItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGuideItemDto,
  ) {
    return this.guideAdminService.updateGuideItem(id, dto);
  }

  // DELETE /admin/guide/items/:id
  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteGuideItem(@Param('id', ParseUUIDPipe) id: string) {
    await this.guideAdminService.deleteGuideItem(id);
  }
}
