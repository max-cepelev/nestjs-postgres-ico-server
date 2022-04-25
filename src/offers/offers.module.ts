import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Offer } from './entities/offers.entity';

@Module({
  providers: [OffersService],
  controllers: [OffersController],
  imports: [SequelizeModule.forFeature([Offer])],
  exports: [OffersService],
})
export class OffersModule {}
