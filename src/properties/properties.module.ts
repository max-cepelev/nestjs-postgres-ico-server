import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Property } from './entities/property.entity';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
  imports: [SequelizeModule.forFeature([Property])],
})
export class PropertiesModule {}
