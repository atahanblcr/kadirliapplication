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
} from '@nestjs/common';
import { StaffAdminService } from './staff-admin.service';
import { CreateAdminStaffDto } from './dto/create-admin-staff.dto';
import { UpdateAdminStaffDto } from './dto/update-admin-staff.dto';
import { UpdateAdminPermissionsDto } from './dto/update-admin-permissions.dto';
import { ResetStaffPasswordDto } from './dto/reset-staff-password.dto';
import { QueryStaffDto } from './dto/query-staff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/staff')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class StaffAdminController {
  constructor(private readonly staffAdminService: StaffAdminService) {}

  // GET /admin/staff
  @Get()
  async getStaffList(
    @CurrentUser('user_id') requestingUserId: string,
    @Query() dto: QueryStaffDto,
  ) {
    return this.staffAdminService.getStaffList(requestingUserId, dto);
  }

  // GET /admin/staff/:id
  @Get(':id')
  async getStaffDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffAdminService.getStaffDetail(id);
  }

  // POST /admin/staff
  @Post()
  async createStaff(
    @CurrentUser('user_id') requestingUserId: string,
    @Body() dto: CreateAdminStaffDto,
  ) {
    return this.staffAdminService.createStaff(requestingUserId, dto);
  }

  // PATCH /admin/staff/:id
  @Patch(':id')
  async updateStaff(
    @CurrentUser('user_id') requestingUserId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminStaffDto,
  ) {
    return this.staffAdminService.updateStaff(requestingUserId, id, dto);
  }

  // PATCH /admin/staff/:id/permissions
  @Patch(':id/permissions')
  async updateStaffPermissions(
    @CurrentUser('user_id') requestingUserId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminPermissionsDto,
  ) {
    return this.staffAdminService.updateStaffPermissions(requestingUserId, id, dto);
  }

  // DELETE /admin/staff/:id
  @Delete(':id')
  @HttpCode(204)
  async deleteStaff(
    @CurrentUser('user_id') requestingUserId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.staffAdminService.deactivateStaff(requestingUserId, id);
  }

  // PATCH /admin/staff/:id/reset-password
  @Patch(':id/reset-password')
  async resetStaffPassword(
    @CurrentUser('user_id') requestingUserId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResetStaffPasswordDto,
  ) {
    return this.staffAdminService.resetStaffPassword(requestingUserId, id, dto);
  }
}
