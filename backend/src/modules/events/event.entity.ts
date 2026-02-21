import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 100 })
  type: string; // wedding, engagement, mundan, etc.

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  stateCode: string;

  @Column({ nullable: true })
  stateName: string;

  @Column({ type: 'date', nullable: true })
  eventDate: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ nullable: true })
  city: string;

  @Column({ default: 0 })
  guestCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column({ default: 'planning' })
  status: string; // planning, confirmed, completed, cancelled

  @Column({ nullable: true })
  userId: number;

  @Column({ type: 'simple-json', nullable: true })
  selectedRituals: number[]; // array of ritual IDs

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
