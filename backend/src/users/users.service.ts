import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['primary_neighborhood'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);

    if (dto.username && dto.username !== user.username) {
      // Aylık değişiklik kontrolü
      if (user.username_last_changed_at) {
        const lastChange = new Date(user.username_last_changed_at);
        const now = new Date();
        const diffMs = now.getTime() - lastChange.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < 30) {
          throw new BadRequestException(
            'Kullanıcı adını bu ay zaten değiştirdiniz. Bir ay sonra tekrar deneyebilirsiniz.',
          );
        }
      }

      // Benzersizlik kontrolü
      const existing = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('Bu kullanıcı adı zaten kullanılıyor');
      }

      user.username = dto.username;
      user.username_last_changed_at = new Date();
    }

    if (dto.primary_neighborhood_id && dto.primary_neighborhood_id !== user.primary_neighborhood_id) {
      // Aylık mahalle değişiklik kontrolü
      if (user.neighborhood_last_changed_at) {
        const lastChange = new Date(user.neighborhood_last_changed_at);
        const now = new Date();
        const diffMs = now.getTime() - lastChange.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (diffDays < 30) {
          throw new BadRequestException(
            'Mahallenizi bu ay zaten değiştirdiniz. Bir ay sonra tekrar deneyebilirsiniz.',
          );
        }
      }

      const neighborhood = await this.neighborhoodRepository.findOne({
        where: { id: dto.primary_neighborhood_id, is_active: true },
      });
      if (!neighborhood) {
        throw new BadRequestException('Seçilen mahalle bulunamadı');
      }

      user.primary_neighborhood_id = dto.primary_neighborhood_id;
      user.neighborhood_last_changed_at = new Date();
    }

    if (dto.age !== undefined) {
      user.age = dto.age;
    }

    if (dto.location_type) {
      user.location_type = dto.location_type;
    }

    await this.userRepository.save(user);

    // Relation'larla birlikte döndür (primary_neighborhood dahil)
    return this.findById(userId);
  }

  async updateNotificationPreferences(
    userId: string,
    dto: UpdateNotificationsDto,
  ): Promise<User['notification_preferences']> {
    const user = await this.findById(userId);

    user.notification_preferences = {
      ...user.notification_preferences,
      ...dto,
    };

    await this.userRepository.save(user);
    return user.notification_preferences;
  }

  async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
    await this.userRepository.update(userId, { fcm_token: fcmToken });
  }
}
