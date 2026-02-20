import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Ad } from './ad.entity';
import { CategoryProperty } from './category-property.entity';

@Entity('ad_property_values')
@Unique(['ad_id', 'property_id'])
export class AdPropertyValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ad_id: string;

  @ManyToOne(() => Ad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column({ type: 'uuid' })
  property_id: string;

  @ManyToOne(() => CategoryProperty)
  @JoinColumn({ name: 'property_id' })
  property: CategoryProperty;

  @Column({ type: 'text' })
  value: string;

  @CreateDateColumn()
  created_at: Date;
}
