import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BusinessCategory } from './business-category.entity';
import { FileEntity } from './file.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 150 })
  business_name: string;

  @Column({ type: 'uuid', nullable: true })
  category_id: string;

  @ManyToOne(() => BusinessCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: BusinessCategory;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tax_number: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  website_url: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  instagram_handle: string;

  @Column({ type: 'uuid', nullable: true })
  logo_file_id: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'logo_file_id' })
  logo: FileEntity;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'uuid', nullable: true })
  verified_by: string;

  @Column({ type: 'timestamp', nullable: true })
  verified_at: Date;

  @OneToMany('Campaign', 'business')
  campaigns: any[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
