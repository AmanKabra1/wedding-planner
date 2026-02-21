import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';

@Injectable()
export class BookingsService {
  constructor(@InjectRepository(Booking) private bookingRepo: Repository<Booking>) {}

  create(data: Partial<Booking>): Promise<Booking> {
    return this.bookingRepo.save(this.bookingRepo.create(data));
  }

  findByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepo.find({ where: { userId }, order: { serviceDate: 'ASC' } });
  }

  update(id: number, data: Partial<Booking>): Promise<any> {
    return this.bookingRepo.update(id, data);
  }

  remove(id: number): Promise<any> {
    return this.bookingRepo.delete(id);
  }
}
