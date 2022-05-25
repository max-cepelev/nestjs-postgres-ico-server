import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './entities/city.entity';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [SequelizeModule.forFeature([City])],
})
export class CitiesModule {}
