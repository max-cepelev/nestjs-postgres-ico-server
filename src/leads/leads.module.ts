import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Lead } from './entities/lead.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';

@Module({
  providers: [LeadsService],
  controllers: [LeadsController],
  imports: [SequelizeModule.forFeature([Lead])],
})
export class LeadsModule {}
