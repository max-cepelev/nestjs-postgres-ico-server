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
import { ComplexesService } from './complexes.service';
import { CreateComplexDto } from './dto/create-complex-dto';

@Controller('complexes')
export class ComplexesController {
  constructor(private readonly complexesService: ComplexesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  bulkCreate(@Body() dto: CreateComplexDto[]) {
    return this.complexesService.bulkCreate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createComplexDto: CreateComplexDto) {
    return this.complexesService.create(createComplexDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('groupId') groupId?: number,
    @Query('areaId') areaId?: number,
    @Query('cityId') cityId?: number,
  ) {
    return this.complexesService.findAll(groupId, areaId, cityId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.complexesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateComplexDto: CreateComplexDto) {
    return this.complexesService.update(+id, updateComplexDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.complexesService.remove(+id);
  }
}
