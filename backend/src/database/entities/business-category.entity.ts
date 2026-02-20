import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('business_categories')
export class BusinessCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string;

  @ManyToOne(() => BusinessCategory, (cat) => cat.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: BusinessCategory;

  @OneToMany(() => BusinessCategory, (cat) => cat.parent)
  children: BusinessCategory[];

  @OneToMany('Business', 'category')
  businesses: any[];

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
