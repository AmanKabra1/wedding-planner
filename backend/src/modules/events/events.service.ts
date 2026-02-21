import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private eventRepo: Repository<Event>) {}

  create(data: Partial<Event>): Promise<Event> {
    const event = this.eventRepo.create(data);
    return this.eventRepo.save(event);
  }

  findAll(userId?: number): Promise<Event[]> {
    if (userId) return this.eventRepo.find({ where: { userId }, order: { eventDate: 'ASC' } });
    return this.eventRepo.find({ order: { eventDate: 'ASC' } });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, data: Partial<Event>): Promise<Event> {
    await this.eventRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.eventRepo.delete(id);
  }
}
