import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AnnouncementType } from './announcement-type.entity';
import { User } from './user.entity';
import { FileEntity } from './file.entity';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  type_id: string;

  @ManyToOne(() => AnnouncementType)
  @JoinColumn({ name: 'type_id' })
  type: AnnouncementType;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'normal',
  })
  priority: 'low' | 'normal' | 'high' | 'emergency';

  @Column({
    type: 'varchar',
    length: 20,
    default: 'all',
  })
  target_type: 'all' | 'neighborhoods' | 'users';

  @Column({ type: 'jsonb', nullable: true })
  target_neighborhoods: string[];

  @Column({ type: 'jsonb', nullable: true })
  target_user_ids: string[];

  @Column({ type: 'timestamp', nullable: true })
  scheduled_for: Date;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date;

  @Column({ type: 'boolean', default: false })
  is_recurring: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  recurrence_pattern: string;

  @Column({ type: 'boolean', default: true })
  send_push_notification: boolean;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'manual',
  })
  source: 'manual' | 'scraping' | 'api';

  @Column({ type: 'text', nullable: true })
  source_url: string;

  @Column({ type: 'timestamp', nullable: true })
  visible_until: Date;

  @Column({ type: 'boolean', default: false })
  has_pdf: boolean;

  @Column({ type: 'uuid', nullable: true })
  pdf_file_id: string;

  @ManyToOne(() => FileEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pdf_file_id' })
  pdf_file: FileEntity;

  @Column({ type: 'boolean', default: false })
  has_link: boolean;

  @Column({ type: 'text', nullable: true })
  external_link: string;

  @Column({ type: 'int', default: 0 })
  view_count: number;

  @Column({ type: 'int', default: 0 })
  click_count: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'draft',
  })
  status: 'draft' | 'scheduled' | 'published' | 'archived';

  @Column({ type: 'uuid' })
  created_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ type: 'uuid', nullable: true })
  approved_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
