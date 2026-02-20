import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ad } from './ad.entity';
import { User } from './user.entity';

@Entity('ad_extensions')
export class AdExtension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  ad_id: string;

  @ManyToOne(() => Ad, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ad_id' })
  ad: Ad;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 3 reklam izlendi → 3 gün uzatma (CLAUDE.md iş kuralı)
  @Column({ type: 'int', default: 0 })
  ads_watched: number;

  @Column({ type: 'int', default: 0 })
  days_extended: number;

  @CreateDateColumn()
  extended_at: Date;
}
