import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateLeadDto } from './dto/create-lead-dto';
import { LeadsService } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post('bulk')
  createBulk(@Body() dto: CreateLeadDto[]) {
    return this.leadsService.createBulk(dto);
  }

  @Post()
  create(@Headers('Referer') referer: string, @Body() body: any) {
    return this.leadsService.create(body, referer);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.leadsService.findAll();
  }
}
