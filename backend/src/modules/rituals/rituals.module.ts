import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ritual } from './ritual.entity';
import { RitualsService } from './rituals.service';
import { RitualsController } from './rituals.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ritual])],
  providers: [RitualsService],
  controllers: [RitualsController],
  exports: [RitualsService],
})
export class RitualsModule {}
