import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateDeathDto } from './dto/create-death.dto';
import { UpdateDeathDto } from './dto/update-death.dto';
import { QueryDeathsDto } from './dto/query-deaths.dto';

@Controller('admin/deaths')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class DeathsAdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/deaths
  @Get()
  async getAllDeaths(@Query() dto: QueryDeathsDto) {
    return this.adminService.getAllDeaths(dto);
  }

  // GET /admin/deaths/cemeteries
  @Get('cemeteries')
  async getCemeteries() {
    return this.adminService.getCemeteries();
  }

  // GET /admin/deaths/mosques
  @Get('mosques')
  async getMosques() {
    return this.adminService.getMosques();
  }

  // GET /admin/deaths/neighborhoods
  @Get('neighborhoods')
  async getNeighborhoods() {
    return this.adminService.getDeathNeighborhoods();
  }

  // POST /admin/deaths
  @Post()
  async createDeath(
    @CurrentUser('id') adminId: string,
    @Body() dto: CreateDeathDto,
  ) {
    return this.adminService.createDeath(adminId, dto);
  }

  // PATCH /admin/deaths/:id
  @Patch(':id')
  async updateDeath(
    @CurrentUser('id') adminId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDeathDto,
  ) {
    return this.adminService.updateDeath(adminId, id, dto);
  }

  // DELETE /admin/deaths/:id
  @Delete(':id')
  async deleteDeath(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteDeath(id);
  }
}
