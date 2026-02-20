import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../database/entities/notification.entity';
import { User } from '../database/entities/user.entity';
import { QueryNotificationDto } from './dto/query-notification.dto';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ── BİLDİRİM LİSTESİ ──────────────────────────────────────────────────────

  async findAll(userId: string, dto: QueryNotificationDto) {
    const { page = 1, limit = 20, unread_only } = dto;
    const skip = (page - 1) * limit;

    const qb = this.notificationRepository
      .createQueryBuilder('n')
      .where('n.user_id = :userId', { userId })
      .orderBy('n.created_at', 'DESC')
      .skip(skip)
      .take(limit);

    if (unread_only) {
      qb.andWhere('n.is_read = :isRead', { isRead: false });
    }

    const notifications = await qb.getMany();

    const unread_count = await this.notificationRepository.count({
      where: { user_id: userId, is_read: false },
    });

    return { notifications, unread_count };
  }

  // ── TEK BİLDİRİM OKUNDU ───────────────────────────────────────────────────

  async markRead(userId: string, id: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!notification) {
      throw new NotFoundException('Bildirim bulunamadı');
    }

    if (!notification.is_read) {
      await this.notificationRepository.update(id, {
        is_read: true,
        read_at: new Date(),
      });
    }

    return { message: 'Okundu olarak işaretlendi' };
  }

  // ── TÜM BİLDİRİMLER OKUNDU ────────────────────────────────────────────────

  async markAllRead(userId: string) {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ is_read: true, read_at: new Date() })
      .where('user_id = :userId AND is_read = :isRead', {
        userId,
        isRead: false,
      })
      .execute();

    return { message: 'Tüm bildirimler okundu' };
  }

  // ── FCM TOKEN KAYIT ────────────────────────────────────────────────────────

  async registerFcmToken(userId: string, dto: RegisterFcmTokenDto) {
    await this.userRepository.update(userId, {
      fcm_token: dto.fcm_token,
    });

    return { message: 'Token kaydedildi' };
  }
}
