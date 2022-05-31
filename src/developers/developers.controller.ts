import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer-dto';
import { UpdateDeveloperDto } from './dto/update-developer-dto';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('bulk')
  bulkCreate(@Body() dto: CreateDeveloperDto[]) {
    return this.developersService.bulkCreate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateDeveloperDto) {
    return this.developersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('groupId') groupId?: number) {
    return this.developersService.findAll(groupId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.developersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDeveloperDto) {
    return this.developersService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developersService.remove(+id);
  }
}
