import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /notifications
  // Bildirimleri listele
  @Get()
  async findAll(
    @CurrentUser('user_id') userId: string,
    @Query() dto: QueryNotificationDto,
  ) {
    return this.notificationsService.findAll(userId, dto);
  }

  // POST /notifications/read-all  (önce tanımlanmalı - :id'den önce!)
  // Tüm bildirimleri okundu işaretle
  @Post('read-all')
  async markAllRead(@CurrentUser('user_id') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }

  // POST /notifications/fcm-token
  // FCM token kaydet
  @Post('fcm-token')
  async registerFcmToken(
    @CurrentUser('user_id') userId: string,
    @Body() dto: RegisterFcmTokenDto,
  ) {
    return this.notificationsService.registerFcmToken(userId, dto);
  }

  // PATCH /notifications/:id/read
  // Tek bildirimi okundu işaretle
  @Patch(':id/read')
  async markRead(
    @CurrentUser('user_id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.notificationsService.markRead(userId, id);
  }
}
