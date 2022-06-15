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

  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  bulkCreate(@Body() dto: CreateBuildingDto[]) {
    return this.buildingsService.bulkCreate(dto);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // create(@Body() dto: CreateBuildingDto) {
  //   return this.buildingsService.create(dto);
  // }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(@Body() dto: CreateBuildingDto, @UploadedFile() img: any) {
    return this.buildingsService.create(dto, img);
  }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id/upload')
  // @UseInterceptors(FileInterceptor('img'))
  // uploadImage(@Param('id') id: string, @UploadedFile() img: any) {
  //   return this.buildingsService.uploadImage(id, img);
  // }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('groupId') groupId?: number,
    @Query('complexId') complexId?: number,
    @Query('cityId') cityId?: number,
    @Query('areaId') areaId?: number,
    @Query('inWork') inWork?: 1 | 0,
    @Query('page') page?: number,
  ) {
    return this.buildingsService.findAll({
      groupId,
      complexId,
      cityId,
      areaId,
      inWork,
      page,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales')
  findAllWithSales(
    @Query('cityId') cityId?: number,
    @Query('areaId') areaId?: number,
  ) {
    return this.buildingsService.findAllWithSales(cityId, areaId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('property/:id')
  findOneWithProperties(@Param('id') buildingId: number) {
    return this.buildingsService.findOneWithProperties(buildingId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('analitics/:id')
  findOneWithAnalitics(@Param('id') id: string) {
    return this.buildingsService.findOneWithAnalitics(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('card/:id')
  getCardData(@Param('id') id: string) {
    return this.buildingsService.getBuildingCardData(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales/:id')
  findOne(@Param('id') id: string) {
    return this.buildingsService.findOneWithSales(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('img'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBuildingDto,
    @UploadedFile() img?: any,
  ) {
    return this.buildingsService.update(+id, dto, img);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buildingsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('complex-dynamics')
  getDinamicsByComplex(@Query('complexId') complexId: number) {
    return this.buildingsService.getDynamicsByComplex(complexId);
  }
}
