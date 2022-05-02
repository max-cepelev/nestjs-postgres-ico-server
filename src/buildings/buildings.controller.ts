import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building-dto';
import { UpdateBuildingDto } from './dto/update-building-dto';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post('bulk')
  bulkCreate(@Body() dto: CreateBuildingDto[]) {
    return this.buildingsService.bulkCreate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateBuildingDto) {
    return this.buildingsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/upload')
  @UseInterceptors(FileInterceptor('img'))
  uploadImage(@Param('id') id: string, @UploadedFile() img: any) {
    return this.buildingsService.uploadImage(id, img);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('complexId') complexId?: number) {
    return this.buildingsService.findAll(complexId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales')
  findAllWithSales() {
    return this.buildingsService.findAllWithSales();
  }

  @UseGuards(JwtAuthGuard)
  @Get('complex-dynamics')
  getDinamicsByComplex(@Query('complexId') complexId: number) {
    return this.buildingsService.getDynamicsByComplex(complexId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('dynamics')
  getDinamicsByBuilding(@Query('buildingId') buildingId: number) {
    return this.buildingsService.getDynamicsByBuilding(buildingId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buildingsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBuildingDto) {
    return this.buildingsService.update(+id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingsService.remove(+id);
  }
}
