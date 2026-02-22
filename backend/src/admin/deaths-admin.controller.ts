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
import { CreateCemeteryDto } from './dto/create-cemetery.dto';
import { UpdateCemeteryDto } from './dto/update-cemetery.dto';
import { CreateMosqueDto } from './dto/create-mosque.dto';
import { UpdateMosqueDto } from './dto/update-mosque.dto';

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

  // POST /admin/deaths/cemeteries
  @Post('cemeteries')
  async createCemetery(@Body() dto: CreateCemeteryDto) {
    return this.adminService.createCemetery(dto);
  }

  // PATCH /admin/deaths/cemeteries/:id
  @Patch('cemeteries/:id')
  async updateCemetery(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCemeteryDto,
  ) {
    return this.adminService.updateCemetery(id, dto);
  }

  // DELETE /admin/deaths/cemeteries/:id
  @Delete('cemeteries/:id')
  async deleteCemetery(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteCemetery(id);
  }

  // GET /admin/deaths/mosques
  @Get('mosques')
  async getMosques() {
    return this.adminService.getMosques();
  }

  // POST /admin/deaths/mosques
  @Post('mosques')
  async createMosque(@Body() dto: CreateMosqueDto) {
    return this.adminService.createMosque(dto);
  }

  // PATCH /admin/deaths/mosques/:id
  @Patch('mosques/:id')
  async updateMosque(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMosqueDto,
  ) {
    return this.adminService.updateMosque(id, dto);
  }

  // DELETE /admin/deaths/mosques/:id
  @Delete('mosques/:id')
  async deleteMosque(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteMosque(id);
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
