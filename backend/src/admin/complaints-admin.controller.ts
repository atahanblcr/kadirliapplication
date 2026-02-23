import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { QueryComplaintsDto } from './dto/query-complaints.dto';
import { UpdateComplaintStatusDto } from './dto/update-complaint-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/complaints')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class ComplaintsAdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/complaints
  @Get()
  async getComplaints(@Query() dto: QueryComplaintsDto) {
    return this.adminService.getComplaints(dto);
  }

  // GET /admin/complaints/:id
  @Get(':id')
  async getComplaint(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.getComplaintById(id);
  }

  // PATCH /admin/complaints/:id/review
  @Patch(':id/review')
  @HttpCode(200)
  async reviewComplaint(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.adminService.reviewComplaint(id, user.id);
  }

  // PATCH /admin/complaints/:id/resolve
  @Patch(':id/resolve')
  @HttpCode(200)
  async resolveComplaint(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateComplaintStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.resolveComplaint(id, dto, user.id);
  }

  // PATCH /admin/complaints/:id/reject
  @Patch(':id/reject')
  @HttpCode(200)
  async rejectComplaint(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateComplaintStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.adminService.rejectComplaint(id, dto, user.id);
  }

  // PATCH /admin/complaints/:id/priority
  @Patch(':id/priority')
  @HttpCode(200)
  async updateComplaintPriority(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: { priority: string },
  ) {
    return this.adminService.updateComplaintPriority(id, dto.priority);
  }
}
