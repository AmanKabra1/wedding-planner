import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Organizers')
@Controller('organizers')
export class OrganizersController {
  constructor(private organizersService: OrganizersService) {}

  // ── Public endpoints ────────────────────────────────────────

  @Get()
  @ApiQuery({ name: 'state', required: false })
  findAll(@Query('state') state?: string) {
    return this.organizersService.findAll(state);
  }

  @Get('prices')
  @ApiQuery({ name: 'eventType', required: false })
  @ApiQuery({ name: 'organizerId', required: false })
  getPrices(
    @Query('eventType') eventType?: string,
    @Query('organizerId') organizerId?: number,
  ) {
    return this.organizersService.getPrices(
      eventType,
      organizerId ? +organizerId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.organizersService.getOrganizerWithPrices(+id);
  }

  // ── Organizer Auth ──────────────────────────────────────────

  @Post('register')
  register(@Body() body: any) {
    return this.organizersService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.organizersService.login(body.email, body.password);
  }

  // ── Profile update ──────────────────────────────────────────

  @Put(':id/profile')
  updateProfile(@Param('id') id: number, @Body() body: any) {
    return this.organizersService.updateProfile(+id, body);
  }

  // ── Price Management ────────────────────────────────────────

  @Post('prices')
  createPrice(@Body() body: any) {
    return this.organizersService.createPrice(body);
  }

  @Put('prices/:id')
  updatePrice(@Param('id') id: number, @Body() body: any) {
    return this.organizersService.updatePrice(+id, body);
  }

  @Delete('prices/:id')
  deletePrice(@Param('id') id: number) {
    return this.organizersService.deletePrice(+id);
  }
}