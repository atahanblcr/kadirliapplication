import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { AdCategory } from './ad-category.entity';

@Entity('category_properties')
@Unique(['category_id', 'property_name'])
export class CategoryProperty {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  category_id: string;

  @ManyToOne(() => AdCategory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: AdCategory;

  @Column({ type: 'varchar', length: 100 })
  property_name: string;

  @Column({ type: 'varchar', length: 20 })
  property_type: 'text' | 'number' | 'dropdown' | 'radio' | 'checkbox' | 'date';

  @Column({ type: 'boolean', default: false })
  is_required: boolean;

  @Column({ type: 'text', nullable: true })
  default_value: string;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @OneToMany(() => PropertyOption, (opt) => opt.property, { cascade: true })
  options: PropertyOption[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity('property_options')
export class PropertyOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  property_id: string;

  @ManyToOne(() => CategoryProperty, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: CategoryProperty;

  @Column({ type: 'varchar', length: 100 })
  option_value: string;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @CreateDateColumn()
  created_at: Date;
}
