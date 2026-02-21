import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('organizers')
export class Organizer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  businessName: string;

  @Column({ length: 100 })
  ownerName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  eventTypes: string[];

  @Column({ type: 'simple-array', nullable: true })
  servicesOffered: string[];

  @Column({ default: 0 })
  experienceYears: number;

  @Column({ default: 0 })
  eventsCompleted: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column({ nullable: true })
  instagramUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}