import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './create-announcement.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {
  @IsEnum(['draft', 'scheduled', 'published', 'archived'], {
    message: 'Durum: draft, scheduled, published veya archived olmalıdır',
  })
  @IsOptional()
  status?: 'draft' | 'scheduled' | 'published' | 'archived';
}
