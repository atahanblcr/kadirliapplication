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
import { User } from './user.entity';
import { FileEntity } from './file.entity';

@Entity('cemeteries')
export class Cemetery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('mosques')
export class Mosque {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}

@Entity('death_notices')
export class DeathNotice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  deceased_name: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'uuid', nullable: true })
  photo_file_id: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'photo_file_id' })
  photo_file: FileEntity;

  @Column({ type: 'date' })
  funeral_date: string;

  @Column({ type: 'time' })
  funeral_time: string;

  @Column({ type: 'uuid', nullable: true })
  cemetery_id: string;

  @ManyToOne(() => Cemetery, { nullable: true })
  @JoinColumn({ name: 'cemetery_id' })
  cemetery: Cemetery;

  @Column({ type: 'uuid', nullable: true })
  mosque_id: string;

  @ManyToOne(() => Mosque, { nullable: true })
  @JoinColumn({ name: 'mosque_id' })
  mosque: Mosque;

  @Column({ type: 'text', nullable: true })
  condolence_address: string;

  @Column({ type: 'uuid' })
  added_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'added_by' })
  adder: User;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'uuid', nullable: true })
  approved_by: string;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @Column({ type: 'text', nullable: true })
  rejected_reason: string;

  @Column({ type: 'timestamp' })
  auto_archive_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
