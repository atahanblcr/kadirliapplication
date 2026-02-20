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
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../database/entities/user.entity';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // ── PUBLIC: Duyuru Tipleri (JWT gerekmez) ───────────────────────────────────

  @Get('types')
  @HttpCode(HttpStatus.OK)
  async getTypes() {
    const types = await this.announcementsService.findTypes();
    return { types };
  }

  // ── KULLANICI: Duyuru Listesi ────────────────────────────────────────────────

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @CurrentUser() user: User,
    @Query() dto: QueryAnnouncementDto,
  ) {
    return this.announcementsService.findAll(user, dto);
  }

  // ── KULLANICI: Duyuru Detayı ─────────────────────────────────────────────────

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const announcement = await this.announcementsService.findOne(id, user);
    return { announcement };
  }

  // ── ADMIN: Duyuru Oluştur ────────────────────────────────────────────────────

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateAnnouncementDto,
  ) {
    return this.announcementsService.create(user.id, dto);
  }

  // ── ADMIN: Duyuru Güncelle ───────────────────────────────────────────────────

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    const announcement = await this.announcementsService.update(id, dto);
    return { announcement };
  }

  // ── ADMIN: Duyuru Sil (Soft Delete) ─────────────────────────────────────────

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.remove(id);
  }

  // ── ADMIN: Hemen Gönder ──────────────────────────────────────────────────────

  @Post(':id/send')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async send(@Param('id', ParseUUIDPipe) id: string) {
    return this.announcementsService.send(id);
  }
}
