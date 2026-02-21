import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './state.entity';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  providers: [StatesService],
  controllers: [StatesController],
  exports: [StatesService],
})
export class StatesModule {}
