import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Building } from './entities/building.entity';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService],
  imports: [SequelizeModule.forFeature([Building])],
})
export class BuildingsModule {}
