import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ComplexesController } from './complexes.controller';
import { ComplexesService } from './complexes.service';
import { Complex } from './entities/complex.entity';

@Module({
  providers: [ComplexesService],
  controllers: [ComplexesController],
  imports: [SequelizeModule.forFeature([Complex])],
})
export class ComplexesModule {}
