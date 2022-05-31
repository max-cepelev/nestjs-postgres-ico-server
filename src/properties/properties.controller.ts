import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  createBulk(@Body() createPropertyDto: CreatePropertyDto[]) {
    return this.propertiesService.createBulk(createPropertyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('buildingId') buildingId?: number,
    @Query('propertyTypeId') propertyTypeId?: number,
  ) {
    return this.propertiesService.findAll(buildingId, propertyTypeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(+id);
  }
}
