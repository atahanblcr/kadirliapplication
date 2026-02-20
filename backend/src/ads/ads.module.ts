import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { Ad } from '../database/entities/ad.entity';
import { AdImage } from '../database/entities/ad-image.entity';
import { AdFavorite } from '../database/entities/ad-favorite.entity';
import { AdExtension } from '../database/entities/ad-extension.entity';
import { AdCategory } from '../database/entities/ad-category.entity';
import { AdPropertyValue } from '../database/entities/ad-property-value.entity';
import { CategoryProperty } from '../database/entities/category-property.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ad,
      AdImage,
      AdFavorite,
      AdExtension,
      AdCategory,
      AdPropertyValue,
      CategoryProperty,
    ]),
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}
