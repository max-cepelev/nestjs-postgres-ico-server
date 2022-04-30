import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/create-offer-dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  bulkCreate(@Body() dto: CreateOfferDto[]) {
    return this.offersService.bulkCreate(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('building-spaces')
  findSpacesByBuildings(
    @Body()
    { buildingIds }: { buildingIds: number[] },
  ) {
    return this.offersService.findDataByBuildings(buildingIds);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buildings')
  findDataByBuildings(
    @Body()
    { buildingIds }: { buildingIds: number[] },
  ) {
    return this.offersService.findSpacesByBuildings(buildingIds);
  }

  @UseGuards(JwtAuthGuard)
  @Get('complexes')
  findDataByComplexes(
    @Body()
    { complexIds }: { complexIds: number[] },
  ) {
    return this.offersService.findSpacesByComplexes(complexIds);
  }
}
