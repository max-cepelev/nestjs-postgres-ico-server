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
  @Post('analysis')
  getAnalysisData(
    @Body()
    buildings: { id: number; name: string }[],
  ) {
    return this.offersService.getAnalysisData(buildings);
  }

  @Post('area')
  getAreaAnalitics(
    @Body()
    { buildingIds }: { buildingIds: number[] },
  ) {
    return this.offersService.getAreaAnalitics(buildingIds);
  }
}
