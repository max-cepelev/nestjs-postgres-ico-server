import { Module } from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';
import { PropertyTypesController } from './property-types.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertyType } from './entities/property-type.entity';

@Module({
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService],
  imports: [SequelizeModule.forFeature([PropertyType])],
})
export class PropertyTypesModule {}
