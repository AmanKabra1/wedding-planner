import { Controller, Get, Param } from '@nestjs/common';
import { StatesService } from './states.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('States')
@Controller('states')
export class StatesController {
  constructor(private statesService: StatesService) {}

  @Get()
  findAll() { return this.statesService.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.statesService.findOne(+id); }

  @Get('code/:code')
  findByCode(@Param('code') code: string) { return this.statesService.findByCode(code.toUpperCase()); }
}
