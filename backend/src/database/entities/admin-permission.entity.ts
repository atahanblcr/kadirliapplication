import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

export enum AdminModule {
  ANNOUNCEMENTS = 'announcements',
  ADS = 'ads',
  DEATHS = 'deaths',
  CAMPAIGNS = 'campaigns',
  USERS = 'users',
  PHARMACY = 'pharmacy',
  TRANSPORT = 'transport',
  NEIGHBORHOODS = 'neighborhoods',
  TAXI = 'taxi',
  EVENTS = 'events',
  GUIDE = 'guide',
  PLACES = 'places',
  COMPLAINTS = 'complaints',
}

@Entity('admin_permissions')
@Unique('UQ_admin_permissions_user_module', ['user_id', 'module'])
export class AdminPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: AdminModule,
  })
  module: AdminModule;

  @Column({ type: 'boolean', default: false })
  can_read: boolean;

  @Column({ type: 'boolean', default: false })
  can_create: boolean;

  @Column({ type: 'boolean', default: false })
  can_update: boolean;

  @Column({ type: 'boolean', default: false })
  can_delete: boolean;

  @Column({ type: 'boolean', default: false })
  can_approve: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
