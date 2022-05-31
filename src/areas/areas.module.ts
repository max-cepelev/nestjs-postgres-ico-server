import { Module } from '@nestjs/common';
import { AreasService } from './areas.service';
import { AreasController } from './areas.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Area } from './entities/area.entity';

@Module({
  controllers: [AreasController],
  providers: [AreasService],
  imports: [SequelizeModule.forFeature([Area])],
})
export class AreasModule {}
