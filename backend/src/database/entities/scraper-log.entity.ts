import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('scraper_logs')
export class ScraperLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  scraper_name: string;

  @Column({ type: 'varchar', length: 20 })
  status: 'success' | 'failed' | 'partial';

  @Column({ type: 'int', default: 0 })
  records_found: number;

  @Column({ type: 'int', default: 0 })
  records_created: number;

  @Column({ type: 'int', default: 0 })
  records_updated: number;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  duration_seconds: number;

  @Column({ type: 'timestamp' })
  started_at: Date;

  @CreateDateColumn()
  completed_at: Date;
}
