import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';
import { Cemetery, DeathNotice, Mosque } from '../database/entities/death-notice.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { Campaign } from '../database/entities/campaign.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
import { ScraperLog } from '../database/entities/scraper-log.entity';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CampaignAdminController } from './campaign-admin.controller';
import { UsersAdminController } from './users-admin.controller';
import { PharmacyAdminController } from './pharmacy-admin.controller';
import { TransportAdminController } from './transport-admin.controller';
import { DeathsAdminController } from './deaths-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Ad,
      DeathNotice,
      Cemetery,
      Mosque,
      Neighborhood,
      Campaign,
      Announcement,
      Notification,
      ScraperLog,
      Pharmacy,
      PharmacySchedule,
      IntercityRoute,
      IntercitySchedule,
      IntracityRoute,
      IntracityStop,
    ]),
  ],
  controllers: [
    AdminController,
    CampaignAdminController,
    UsersAdminController,
    PharmacyAdminController,
    TransportAdminController,
    DeathsAdminController,
  ],
  providers: [AdminService],
})
export class AdminModule {}
