import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersAdminService } from './users-admin.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class UsersAdminController {
  constructor(private readonly usersAdminService: UsersAdminService) {}

  // GET /admin/users
  @Get()
  async getUsers(@Query() dto: QueryUsersDto) {
    return this.usersAdminService.getUsers(dto);
  }

  // GET /admin/users/:id
  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersAdminService.getUser(id);
  }

  // POST /admin/users/:id/ban
  @Post(':id/ban')
  async banUser(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BanUserDto,
  ) {
    return this.usersAdminService.banUser(adminId, id, dto);
  }

  // POST /admin/users/:id/unban
  @Post(':id/unban')
  async unbanUser(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.usersAdminService.unbanUser(adminId, id);
  }

  // PATCH /admin/users/:id/role
  @Patch(':id/role')
  async changeUserRole(
    @CurrentUser('user_id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeRoleDto,
  ) {
    return this.usersAdminService.changeUserRole(adminId, id, dto);
  }
}
