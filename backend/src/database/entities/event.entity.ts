import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { EventCategory } from './event-category.entity';
import { User } from './user.entity';
import { FileEntity } from './file.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  // Plain text (docs/10_CORRECTIONS_AND_UPDATES.md - Rich Text Editor kullanma)
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @ManyToOne(() => EventCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: EventCategory;

  @Column({ type: 'date' })
  event_date: string;

  @Column({ type: 'time' })
  event_time: string;

  @Column({ type: 'int', nullable: true })
  duration_minutes: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  venue_name: string;

  @Column({ type: 'text', nullable: true })
  venue_address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  organizer: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ticket_price: number;

  @Column({ type: 'boolean', default: true })
  is_free: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  age_restriction: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'text', nullable: true })
  website_url: string;

  @Column({ type: 'text', nullable: true })
  ticket_url: string;

  @Column({ type: 'uuid', nullable: true })
  cover_image_id: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'cover_image_id' })
  cover_image: FileEntity;

  @Column({ type: 'boolean', default: false })
  is_recurring: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  recurrence_pattern: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status: 'draft' | 'published' | 'cancelled' | 'archived';

  @Column({ type: 'uuid' })
  created_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => EventImage, (img) => img.event, { cascade: true })
  images: EventImage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

@Entity('event_images')
export class EventImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  event_id: string;

  @ManyToOne(() => Event, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'uuid' })
  file_id: string;

  @ManyToOne(() => FileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;
}
