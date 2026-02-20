import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DeathsService } from './deaths.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { CreateDeathNoticeDto } from './dto/create-death-notice.dto';
import { QueryDeathNoticeDto } from './dto/query-death-notice.dto';

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

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: User,
    @Body() dto: CreateDeathNoticeDto,
  ) {
    return this.deathsService.create(user.id, dto);
  }
}
