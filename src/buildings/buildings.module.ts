import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Building } from './entities/building.entity';
import { BuildingsController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { FilesModule } from 'src/files/files.module';
import { PropertiesModule } from 'src/properties/properties.module';
import { SalesModule } from 'src/sales/sales.module';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService],
  imports: [
    SequelizeModule.forFeature([Building]),
    FilesModule,
    PropertiesModule,
    SalesModule,
  ],
})
export class BuildingsModule {}
