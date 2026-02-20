import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { TaxiDriver } from './taxi-driver.entity';

@Entity('taxi_calls')
export class TaxiCall {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  passenger_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;

  @Column({ type: 'uuid' })
  driver_id: string;

  @ManyToOne(() => TaxiDriver, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: TaxiDriver;

  @CreateDateColumn()
  called_at: Date;
}
