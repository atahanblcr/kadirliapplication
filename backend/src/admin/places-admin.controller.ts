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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PlacesAdminService } from './places-admin.service';
import { CreatePlaceCategoryDto } from './dto/create-place-category.dto';
import { UpdatePlaceCategoryDto } from './dto/update-place-category.dto';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { QueryAdminPlacesDto } from './dto/query-admin-places.dto';
import { AddPlaceImagesDto } from './dto/add-place-images.dto';
import { ReorderPlaceImagesDto } from './dto/reorder-place-images.dto';

@Controller('admin/places')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class PlacesAdminController {
  constructor(private readonly placesAdminService: PlacesAdminService) {}

  // ── KATEGORİLER ──────────────────────────────────────────────────────────

  // GET /admin/places/categories
  @Get('categories')
  getPlaceCategories() {
    return this.placesAdminService.getPlaceCategories();
  }

  // POST /admin/places/categories
  @Post('categories')
  createPlaceCategory(@Body() dto: CreatePlaceCategoryDto) {
    return this.placesAdminService.createPlaceCategory(dto);
  }

  // PATCH /admin/places/categories/:id
  @Patch('categories/:id')
  updatePlaceCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlaceCategoryDto,
  ) {
    return this.placesAdminService.updatePlaceCategory(id, dto);
  }

  // DELETE /admin/places/categories/:id
  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlaceCategory(@Param('id', ParseUUIDPipe) id: string) {
    await this.placesAdminService.deletePlaceCategory(id);
  }

  // ── FOTOĞRAF YÖNETİMİ (spesifik rotalar önce gelmeli) ────────────────────

  // DELETE /admin/places/images/:imageId
  @Delete('images/:imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlaceImage(@Param('imageId', ParseUUIDPipe) imageId: string) {
    await this.placesAdminService.deletePlaceImage(imageId);
  }

  // PATCH /admin/places/images/:imageId/set-cover
  @Patch('images/:imageId/set-cover')
  setPlaceCoverImage(@Param('imageId', ParseUUIDPipe) imageId: string) {
    return this.placesAdminService.setPlaceCoverImage(imageId);
  }

  // ── MEKANLAR ─────────────────────────────────────────────────────────────

  // GET /admin/places
  @Get()
  getPlaces(@Query() dto: QueryAdminPlacesDto) {
    return this.placesAdminService.getAdminPlaces(dto);
  }

  // GET /admin/places/:id
  @Get(':id')
  getPlace(@Param('id', ParseUUIDPipe) id: string) {
    return this.placesAdminService.getAdminPlace(id);
  }

  // POST /admin/places
  @Post()
  createPlace(
    @Body() dto: CreatePlaceDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.placesAdminService.createPlace(dto, userId);
  }

  // PATCH /admin/places/:id
  @Patch(':id')
  updatePlace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePlaceDto,
  ) {
    return this.placesAdminService.updatePlace(id, dto);
  }

  // DELETE /admin/places/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlace(@Param('id', ParseUUIDPipe) id: string) {
    await this.placesAdminService.deletePlace(id);
  }

  // POST /admin/places/:id/images
  @Post(':id/images')
  addPlaceImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddPlaceImagesDto,
  ) {
    return this.placesAdminService.addPlaceImages(id, dto);
  }

  // PATCH /admin/places/:id/images/reorder
  @Patch(':id/images/reorder')
  reorderPlaceImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReorderPlaceImagesDto,
  ) {
    return this.placesAdminService.reorderPlaceImages(id, dto);
  }
}
