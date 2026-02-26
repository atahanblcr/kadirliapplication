import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeathsService } from './deaths.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../database/entities/user.entity';
import { QueryDeathNoticeDto } from './dto/query-death-notice.dto';
import { RejectDeathNoticeDto } from './dto/reject-death-notice.dto';

const ADMIN_ROLES = [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MODERATOR];

@Controller('deaths')
export class DeathsController {
  constructor(private readonly deathsService: DeathsService) {}

  // ── PUBLIC ─────────────────────────────────────────────────────────────────

  @Get('cemeteries')
  async getCemeteries() {
    const cemeteries = await this.deathsService.findCemeteries();
    return { cemeteries };
  }

  @Get('mosques')
  async getMosques() {
    const mosques = await this.deathsService.findMosques();
    return { mosques };
  }

  // ── ADMIN: LİSTE (/:id'den önce olmalı) ────────────────────────────────────

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  @HttpCode(HttpStatus.OK)
  async findAllAdmin(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.deathsService.findAllAdmin({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      status,
      search,
    });
  }

  // ── ADMIN: ONAYLA ──────────────────────────────────────────────────────────

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.deathsService.approveNotice(id, user.id);
  }

  // ── ADMIN: REDDET ──────────────────────────────────────────────────────────

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  @HttpCode(HttpStatus.OK)
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectDeathNoticeDto,
  ) {
    return this.deathsService.rejectNotice(id, dto.reason, dto.note);
  }

  // ── ADMIN: SİL ─────────────────────────────────────────────────────────────

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ADMIN_ROLES)
  @HttpCode(HttpStatus.OK)
  async adminDelete(@Param('id', ParseUUIDPipe) id: string) {
    return this.deathsService.adminDelete(id);
  }

  // ── AUTHENTICATED ──────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() dto: QueryDeathNoticeDto) {
    return this.deathsService.findAll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const notice = await this.deathsService.findOne(id);
    return { notice };
  }

}
