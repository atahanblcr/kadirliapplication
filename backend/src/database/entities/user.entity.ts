import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { Neighborhood } from './neighborhood.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  username: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true })
  primary_neighborhood_id: string;

  @ManyToOne(() => Neighborhood, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'primary_neighborhood_id' })
  primary_neighborhood: Neighborhood;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  location_type: 'neighborhood' | 'village';

  @Column({
    type: 'jsonb',
    default: {
      announcements: true,
      deaths: true,
      pharmacy: true,
      events: true,
      ads: false,
      campaigns: false,
    },
  })
  notification_preferences: {
    announcements: boolean;
    deaths: boolean;
    pharmacy: boolean;
    events: boolean;
    ads: boolean;
    campaigns: boolean;
  };

  @Column({ type: 'text', nullable: true })
  fcm_token: string;

  @Column({ type: 'text', nullable: true })
  profile_photo_url: string;

  @Column({ type: 'timestamp', nullable: true })
  username_last_changed_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  neighborhood_last_changed_at: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_banned: boolean;

  @Column({ type: 'text', nullable: true })
  ban_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  banned_at: Date;

  @Column({ type: 'uuid', nullable: true })
  banned_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
