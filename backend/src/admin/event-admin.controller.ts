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
import { AdminService } from './admin.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { QueryAdminEventsDto } from './dto/query-admin-events.dto';
import { CreateEventCategoryDto } from './dto/create-event-category.dto';

@Controller('admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class EventAdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/events/categories
  @Get('categories')
  getEventCategories() {
    return this.adminService.getEventCategories();
  }

  // POST /admin/events/categories
  @Post('categories')
  createEventCategory(@Body() dto: CreateEventCategoryDto) {
    return this.adminService.createEventCategory(dto);
  }

  // GET /admin/events
  @Get()
  getEvents(
    @Query() dto: QueryAdminEventsDto,
    @Query('is_local') isLocalRaw?: string,
  ) {
    const is_local =
      isLocalRaw === 'true' ? true : isLocalRaw === 'false' ? false : undefined;
    return this.adminService.getAdminEvents({ ...dto, is_local });
  }

  // GET /admin/events/:id
  @Get(':id')
  getEvent(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getAdminEvent(id);
  }

  // POST /admin/events
  @Post()
  createEvent(
    @Body() dto: CreateEventDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.adminService.createEvent(dto, userId);
  }

  // PATCH /admin/events/:id
  @Patch(':id')
  updateEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.adminService.updateEvent(id, dto);
  }

  // DELETE /admin/events/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteEvent(@Param('id', ParseUUIDPipe) id: string) {
    await this.adminService.deleteEvent(id);
  }
}
