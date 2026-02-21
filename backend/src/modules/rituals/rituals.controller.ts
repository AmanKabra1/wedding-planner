import { Controller, Get, Param, Query } from '@nestjs/common';
import { RitualsService } from './rituals.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Rituals')
@Controller('rituals')
export class RitualsController {
  constructor(private ritualsService: RitualsService) {}

  @Get()
  @ApiQuery({ name: 'eventType', required: false })
  @ApiQuery({ name: 'stateId', required: false })
  findAll(@Query('eventType') eventType?: string, @Query('stateId') stateId?: number) {
    return this.ritualsService.findAll(eventType, stateId ? +stateId : undefined);
  }

  @Get('event-types')
  getEventTypes() { return this.ritualsService.getEventTypes(); }

  @Get('event/:type')
  findByEventType(@Param('type') type: string) {
    return this.ritualsService.findByEventType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: number) { return this.ritualsService.findOne(+id); }
}
