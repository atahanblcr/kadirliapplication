import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';
import { DeathNotice } from '../database/entities/death-notice.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
import { ScraperLog } from '../database/entities/scraper-log.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Ad,
      DeathNotice,
      Campaign,
      Announcement,
      Notification,
      ScraperLog,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
