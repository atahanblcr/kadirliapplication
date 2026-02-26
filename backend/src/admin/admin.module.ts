import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Ad } from '../database/entities/ad.entity';
import { Cemetery, DeathNotice, Mosque } from '../database/entities/death-notice.entity';
import { Neighborhood } from '../database/entities/neighborhood.entity';
import { Campaign, CampaignImage } from '../database/entities/campaign.entity';
import { Business } from '../database/entities/business.entity';
import { BusinessCategory } from '../database/entities/business-category.entity';
import { FileEntity } from '../database/entities/file.entity';
import { Announcement } from '../database/entities/announcement.entity';
import { Notification } from '../database/entities/notification.entity';
import { Pharmacy, PharmacySchedule } from '../database/entities/pharmacy.entity';
import {
  IntercityRoute,
  IntercitySchedule,
  IntracityRoute,
  IntracityStop,
} from '../database/entities/transport.entity';
import { TaxiDriver } from '../database/entities/taxi-driver.entity';
import { Event, EventImage } from '../database/entities/event.entity';
import { EventCategory } from '../database/entities/event-category.entity';
import { GuideCategory, GuideItem } from '../database/entities/guide.entity';
import {
  Place,
  PlaceCategory,
  PlaceImage,
} from '../database/entities/place.entity';
import { Complaint } from '../database/entities/complaint.entity';
import { AdminPermission } from '../database/entities/admin-permission.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { CampaignAdminController } from './campaign-admin.controller';
import { UsersAdminController } from './users-admin.controller';
import { PharmacyAdminController } from './pharmacy-admin.controller';
import { TransportAdminController } from './transport-admin.controller';
import { DeathsAdminController } from './deaths-admin.controller';
import { TaxiAdminController } from './taxi-admin.controller';
import { EventAdminController } from './event-admin.controller';
import { GuideAdminController } from './guide-admin.controller';
import { PlacesAdminController } from './places-admin.controller';
import { ComplaintsAdminController } from './complaints-admin.controller';
import { ComplaintsAdminService } from './complaints-admin.service';
import { StaffAdminService } from './staff-admin.service';
import { StaffAdminController } from './staff-admin.controller';

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
      CampaignImage,
      Business,
      BusinessCategory,
      FileEntity,
      Announcement,
      Notification,
      Pharmacy,
      PharmacySchedule,
      IntercityRoute,
      IntercitySchedule,
      IntracityRoute,
      IntracityStop,
      TaxiDriver,
      Event,
      EventImage,
      EventCategory,
      GuideCategory,
      GuideItem,
      PlaceCategory,
      Place,
      PlaceImage,
      Complaint,
      AdminPermission,
    ]),
  ],
  controllers: [
    AdminController,
    CampaignAdminController,
    UsersAdminController,
    PharmacyAdminController,
    TransportAdminController,
    DeathsAdminController,
    TaxiAdminController,
    EventAdminController,
    GuideAdminController,
    PlacesAdminController,
    ComplaintsAdminController,
    StaffAdminController,
  ],
  providers: [AdminService, ComplaintsAdminService, StaffAdminService],
})
export class AdminModule {}
