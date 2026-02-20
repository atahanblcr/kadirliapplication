import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'uuid', nullable: true })
  related_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  related_type: string;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @Column({ type: 'timestamp', nullable: true })
  read_at: Date;

  @Column({ type: 'boolean', default: false })
  fcm_sent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fcm_sent_at: Date;

  @Column({ type: 'text', nullable: true })
  fcm_error: string;

  @CreateDateColumn()
  created_at: Date;
}
