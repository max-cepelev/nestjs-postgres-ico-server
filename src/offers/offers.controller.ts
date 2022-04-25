import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer-dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @Post('bulk')
  bulkCreate(@Body() dto: CreateOfferDto[]) {
    return this.offersService.bulkCreate(dto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get('avarage')
  findAvarage(
    @Body()
    { complexIds, roomsAmount }: { complexIds: number[]; roomsAmount: number },
  ) {
    return this.offersService.findAvarage(complexIds, roomsAmount);
  }
}
