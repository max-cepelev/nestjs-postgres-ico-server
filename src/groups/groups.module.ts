import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  providers: [GroupsService],
  controllers: [GroupsController],
  imports: [SequelizeModule.forFeature([Group])],
})
export class GroupsModule {}
