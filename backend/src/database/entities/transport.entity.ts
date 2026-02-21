import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

// ── Şehir Dışı Hatlar ──────────────────────────────────────────────────────────

@Entity('intercity_routes')
export class IntercityRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Legacy column (kept for public API backward compatibility)
  @Column({ type: 'varchar', length: 100 })
  destination: string;

  // Legacy column (kept for public API backward compatibility)
  @Column({ type: 'varchar', length: 100, nullable: true })
  company: string;

  // Admin fields
  @Column({ type: 'varchar', length: 100, nullable: true })
  company_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  from_city: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  duration_minutes: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact_phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_website: string;

  // Stored as comma-separated string: "WiFi,Klima,TV"
  @Column({ type: 'simple-array', nullable: true })
  amenities: string[];

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => IntercitySchedule, (s) => s.route, { cascade: true })
  schedules: IntercitySchedule[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('intercity_schedules')
export class IntercitySchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  route_id: string;

  @ManyToOne(() => IntercityRoute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: IntercityRoute;

  @Column({ type: 'time' })
  departure_time: string;

  // Stored as comma-separated string: "1,2,3,4,5"
  @Column({ type: 'simple-array', nullable: true })
  days_of_week: number[];

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}

// ── Şehir İçi Rotalar ─────────────────────────────────────────────────────────

@Entity('intracity_routes')
export class IntracityRoute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20 })
  route_number: string;

  @Column({ type: 'varchar', length: 200 })
  route_name: string;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color: string;

  @Column({ type: 'time', nullable: true })
  first_departure: string;

  @Column({ type: 'time', nullable: true })
  last_departure: string;

  @Column({ type: 'int', nullable: true })
  frequency_minutes: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  fare: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => IntracityStop, (s) => s.route, { cascade: true })
  stops: IntracityStop[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('intracity_stops')
export class IntracityStop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  route_id: string;

  @ManyToOne(() => IntracityRoute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: IntracityRoute;

  @Column({ type: 'varchar', length: 100 })
  stop_name: string;

  @Column({ type: 'int' })
  stop_order: number;

  @Column({ type: 'int', nullable: true })
  time_from_start: number;

  @Column({ type: 'uuid', nullable: true })
  neighborhood_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn()
  created_at: Date;
}
