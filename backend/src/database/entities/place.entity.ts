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
import { User } from './user.entity';
import { FileEntity } from './file.entity';

@Entity('place_categories')
export class PlaceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => Place, (p) => p.category)
  places: Place[];

  @CreateDateColumn()
  created_at: Date;
}

@Entity('places')
export class Place {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @ManyToOne(() => PlaceCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: PlaceCategory;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  // Plain text (docs/10_CORRECTIONS_AND_UPDATES.md)
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  entrance_fee: number;

  @Column({ type: 'boolean', default: true })
  is_free: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  opening_hours: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  best_season: string;

  @Column({ type: 'text', nullable: true })
  how_to_get_there: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  distance_from_center: number;

  @Column({ type: 'uuid', nullable: true })
  cover_image_id: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'cover_image_id' })
  cover_image: FileEntity;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'uuid' })
  created_by: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => PlaceImage, (img) => img.place, { cascade: true })
  images: PlaceImage[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('place_images')
export class PlaceImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  place_id: string;

  @ManyToOne(() => Place, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ type: 'uuid' })
  file_id: string;

  @ManyToOne(() => FileEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;
}
