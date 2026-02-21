import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { State } from '../states/state.entity';

@Entity('rituals')
export class Ritual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, nullable: true })
  localName: string; // Name in local language

  @Column({ length: 100 })
  eventType: string; // wedding, childbirth, mundan, engagement, etc.

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  significance: string;

  @Column({ type: 'text', nullable: true })
  procedure: string;

  @Column({ type: 'simple-array', nullable: true })
  requiredItems: string[]; // items needed for ritual

  @Column({ default: 1 })
  dayNumber: number; // which day of ceremony

  @Column({ nullable: true })
  timing: string; // morning, evening, night, etc.

  @Column({ default: false })
  isStateSpecific: boolean;

  @Column({ nullable: true })
  stateId: number;

  @ManyToOne(() => State, state => state.rituals, { nullable: true })
  @JoinColumn({ name: 'stateId' })
  state: State;

  @CreateDateColumn()
  createdAt: Date;
}
