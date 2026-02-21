import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Ritual } from '../rituals/ritual.entity';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  code: string; // e.g., RJ, MH, UP

  @Column({ length: 100 })
  language: string;

  @Column({ length: 200, nullable: true })
  region: string; // North, South, East, West, Central

  @Column({ type: 'text', nullable: true })
  culture: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Ritual, ritual => ritual.state)
  rituals: Ritual[];
}
