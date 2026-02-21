import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  create(@Request() req, @Body() body: any) {
    return this.bookingsService.create({ ...body, userId: req.user.id });
  }

  @Get()
  findAll(@Request() req) { return this.bookingsService.findByUser(req.user.id); }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) { return this.bookingsService.update(+id, body); }

  @Delete(':id')
  remove(@Param('id') id: number) { return this.bookingsService.remove(+id); }
}
