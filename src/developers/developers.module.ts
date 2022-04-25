import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { Developer } from './entities/developer.entity';

@Module({
  providers: [DevelopersService],
  controllers: [DevelopersController],
  imports: [SequelizeModule.forFeature([Developer])],
})
export class DevelopersModule {}
