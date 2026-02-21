import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('organizer_prices')
export class OrganizerPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizerId: number;

  @Column({ length: 100 })
  eventType: string;

  @Column({ length: 150 })
  packageName: string;

  @Column({ type: 'text', nullable: true })
  packageDescription: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  basePrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  maxPrice: number;

  @Column({ nullable: true })
  priceUnit: string;

  @Column({ type: 'simple-array', nullable: true })
  inclusions: string[];

  @Column({ type: 'simple-array', nullable: true })
  exclusions: string[];

  @Column({ nullable: true })
  guestCountMin: number;

  @Column({ nullable: true })
  guestCountMax: number;

  @Column({ default: true })
  isNegotiable: boolean;

  @Column({ default: true })
  isActive: boolean;
}
