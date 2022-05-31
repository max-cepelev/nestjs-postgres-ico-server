import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post('bulk')
  createBulk(@Body() createAreaDto: CreateAreaDto[]) {
    return this.areasService.createBulk(createAreaDto);
  }

  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  findAll(@Query('cityId') cityId?: number) {
    return this.areasService.findAll(cityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
