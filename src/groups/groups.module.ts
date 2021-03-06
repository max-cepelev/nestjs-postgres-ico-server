import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PropertiesModule } from 'src/properties/properties.module';
import { SalesModule } from 'src/sales/sales.module';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
  imports: [SequelizeModule.forFeature([Group]), PropertiesModule, SalesModule],
})
export class GroupsModule {}
