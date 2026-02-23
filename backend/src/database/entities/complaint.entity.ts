import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  user_id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 'complaint' | 'suggestion'
  @Column({ type: 'varchar', length: 20, default: 'complaint' })
  type: string;

  // What is being complained about: 'ad' | 'announcement' | 'campaign' | 'user' | 'death' | 'other'
  @Column({ type: 'varchar', length: 50, nullable: true })
  related_module: string;

  @Column({ type: 'uuid', nullable: true })
  related_id: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  // 'spam' | 'inappropriate' | 'false_info' | 'harassment' | 'other'
  @Column({ type: 'varchar', length: 30, nullable: true })
  reason: string;

  // 'low' | 'medium' | 'high' | 'urgent'
  @Column({ type: 'varchar', length: 10, default: 'medium' })
  priority: string;

  @Column({ type: 'simple-array', nullable: true })
  evidence_file_ids: string[];

  // 'pending' | 'reviewing' | 'resolved' | 'rejected'
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  admin_notes: string;

  // Set when admin changes status to 'reviewing'
  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;

  // Set when admin resolves or rejects
  @Column({ type: 'uuid', nullable: true })
  resolved_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolved_by' })
  resolver: User;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
