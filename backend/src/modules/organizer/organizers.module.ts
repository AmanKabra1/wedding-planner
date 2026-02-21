import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organizer } from './organizer.entity';
import { OrganizerPrice } from './organizer-price.entity';
import { OrganizersService } from './organizers.service';
import { OrganizersController } from './organizers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organizer, OrganizerPrice])],
  providers: [OrganizersService],
  controllers: [OrganizersController],
  exports: [OrganizersService],
})
export class OrganizersModule {}
