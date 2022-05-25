import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { RegionsController } from './regions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Region } from './entities/region.entity';

@Module({
  controllers: [RegionsController],
  providers: [RegionsService],
  imports: [SequelizeModule.forFeature([Region])],
})
export class RegionsModule {}
