import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { FileEntity } from './file.entity';

@Entity('taxi_drivers')
export class TaxiDriver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true, nullable: true })
  user_id: string | null;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 15 })
  phone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  plaka: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  vehicle_info: string;

  @Column({ type: 'uuid', nullable: true })
  license_file_id: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'license_file_id' })
  license_file: FileEntity;

  @Column({ type: 'uuid', nullable: true })
  registration_file_id: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'registration_file_id' })
  registration_file: FileEntity;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'uuid', nullable: true })
  verified_by: string;

  @Column({ type: 'timestamp', nullable: true })
  verified_at: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  total_calls: number;

  @OneToMany('TaxiCall', 'driver')
  taxi_calls: any[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
