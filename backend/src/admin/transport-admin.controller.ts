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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransportAdminService } from './transport-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { QueryIntercityRoutesDto } from './dto/query-intercity-routes.dto';
import { CreateIntercityRouteDto } from './dto/create-intercity-route.dto';
import { UpdateIntercityRouteDto } from './dto/update-intercity-route.dto';
import { CreateIntercityScheduleDto } from './dto/create-intercity-schedule.dto';
import { UpdateIntercityScheduleDto } from './dto/update-intercity-schedule.dto';
import { QueryIntracityRoutesDto } from './dto/query-intracity-routes.dto';
import { CreateIntracityRouteDto } from './dto/create-intracity-route.dto';
import { UpdateIntracityRouteDto } from './dto/update-intracity-route.dto';
import { CreateIntracityStopDto } from './dto/create-intracity-stop.dto';
import { UpdateIntracityStopDto } from './dto/update-intracity-stop.dto';
import { ReorderStopDto } from './dto/reorder-stop.dto';

@Controller('admin/transport')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class TransportAdminController {
  constructor(private readonly transportAdminService: TransportAdminService) {}

  // ── ŞEHİRLERARASI ──────────────────────────────────────────────────────────

  // GET /admin/transport/intercity
  @Get('intercity')
  async getIntercityRoutes(@Query() dto: QueryIntercityRoutesDto) {
    return this.transportAdminService.getAdminIntercityRoutes(dto);
  }

  // GET /admin/transport/intercity/:id
  @Get('intercity/:id')
  async getIntercityRoute(@Param('id', ParseUUIDPipe) id: string) {
    return this.transportAdminService.getAdminIntercityRoute(id);
  }

  // POST /admin/transport/intercity
  @Post('intercity')
  async createIntercityRoute(@Body() dto: CreateIntercityRouteDto) {
    return this.transportAdminService.createIntercityRoute(dto);
  }

  // PATCH /admin/transport/intercity/:id
  @Patch('intercity/:id')
  async updateIntercityRoute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIntercityRouteDto,
  ) {
    return this.transportAdminService.updateIntercityRoute(id, dto);
  }

  // DELETE /admin/transport/intercity/:id
  @Delete('intercity/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIntercityRoute(@Param('id', ParseUUIDPipe) id: string) {
    return this.transportAdminService.deleteIntercityRoute(id);
  }

  // POST /admin/transport/intercity/:id/schedules
  @Post('intercity/:id/schedules')
  async addIntercitySchedule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateIntercityScheduleDto,
  ) {
    return this.transportAdminService.addIntercitySchedule(id, dto);
  }

  // PATCH /admin/transport/intercity/schedules/:scheduleId
  @Patch('intercity/schedules/:scheduleId')
  async updateIntercitySchedule(
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @Body() dto: UpdateIntercityScheduleDto,
  ) {
    return this.transportAdminService.updateIntercitySchedule(scheduleId, dto);
  }

  // DELETE /admin/transport/intercity/schedules/:scheduleId
  @Delete('intercity/schedules/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIntercitySchedule(
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
  ) {
    return this.transportAdminService.deleteIntercitySchedule(scheduleId);
  }

  // ── ŞEHİR İÇİ ─────────────────────────────────────────────────────────────

  // GET /admin/transport/intracity
  @Get('intracity')
  async getIntracityRoutes(@Query() dto: QueryIntracityRoutesDto) {
    return this.transportAdminService.getAdminIntracityRoutes(dto);
  }

  // GET /admin/transport/intracity/:id
  @Get('intracity/:id')
  async getIntracityRoute(@Param('id', ParseUUIDPipe) id: string) {
    return this.transportAdminService.getAdminIntracityRoute(id);
  }

  // POST /admin/transport/intracity
  @Post('intracity')
  async createIntracityRoute(@Body() dto: CreateIntracityRouteDto) {
    return this.transportAdminService.createIntracityRoute(dto);
  }

  // PATCH /admin/transport/intracity/:id
  @Patch('intracity/:id')
  async updateIntracityRoute(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateIntracityRouteDto,
  ) {
    return this.transportAdminService.updateIntracityRoute(id, dto);
  }

  // DELETE /admin/transport/intracity/:id
  @Delete('intracity/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIntracityRoute(@Param('id', ParseUUIDPipe) id: string) {
    return this.transportAdminService.deleteIntracityRoute(id);
  }

  // POST /admin/transport/intracity/:id/stops
  @Post('intracity/:id/stops')
  async addIntracityStop(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateIntracityStopDto,
  ) {
    return this.transportAdminService.addIntracityStop(id, dto);
  }

  // PATCH /admin/transport/intracity/stops/:stopId
  @Patch('intracity/stops/:stopId')
  async updateIntracityStop(
    @Param('stopId', ParseUUIDPipe) stopId: string,
    @Body() dto: UpdateIntracityStopDto,
  ) {
    return this.transportAdminService.updateIntracityStop(stopId, dto);
  }

  // DELETE /admin/transport/intracity/stops/:stopId
  @Delete('intracity/stops/:stopId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteIntracityStop(@Param('stopId', ParseUUIDPipe) stopId: string) {
    return this.transportAdminService.deleteIntracityStop(stopId);
  }

  // PATCH /admin/transport/intracity/stops/:stopId/reorder
  @Patch('intracity/stops/:stopId/reorder')
  async reorderIntracityStop(
    @Param('stopId', ParseUUIDPipe) stopId: string,
    @Body() dto: ReorderStopDto,
  ) {
    return this.transportAdminService.reorderIntracityStop(stopId, dto);
  }
}
