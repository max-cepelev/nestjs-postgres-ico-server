import { Module } from '@nestjs/common';
import { ParsingService } from './parsing.service';
import { ParsingController } from './parsing.controller';
import { PuppeteerModule } from 'nest-puppeteer';
import { OffersModule } from 'src/offers/offers.module';
import { ComplexesModule } from 'src/complexes/complexes.module';

@Module({
  providers: [ParsingService],
  controllers: [ParsingController],
  imports: [
    PuppeteerModule.forRoot({ pipe: true }),
    OffersModule,
    ComplexesModule,
  ],
})
export class ParsingModule {}
