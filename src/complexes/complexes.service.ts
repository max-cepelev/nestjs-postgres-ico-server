import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { WhereOptions } from 'sequelize';
import { Area } from 'src/areas/entities/area.entity';
import { City } from 'src/cities/entities/city.entity';
import { Group } from 'src/groups/entities/group.entity';
import { CreateComplexDto } from './dto/create-complex-dto';
import { UpdateComplexDto } from './dto/update-complex-dto';
import { Complex } from './entities/complex.entity';

@Injectable()
export class ComplexesService {
  constructor(
    @InjectModel(Complex) private complexesRepository: typeof Complex,
  ) {}

  async bulkCreate(dto: CreateComplexDto[]) {
    const data = await this.complexesRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'name',
        'shortName',
        'website',
        'info',
        'domRfId',
        'domClickId',
        'cityId',
        'areaId',
      ],
    });
    return data;
  }

  async create(dto: CreateComplexDto) {
    const complex = await this.complexesRepository.create(dto);
    return complex;
  }

  async findAll(groupId?: number, areaId?: number, cityId?: number) {
    const keys = [];
    groupId && keys.push({ groupId: groupId == 0 ? null : groupId });
    areaId && keys.push({ areaId });
    cityId && keys.push({ cityId });
    const where: WhereOptions<Complex> = {
      [Op.and]: keys,
    };

    const complexes = await this.complexesRepository.findAll({
      where,
      include: [City, Group, Area],
      order: [['name', 'ASC']],
    });
    return complexes;
  }

  async findOne(id: number) {
    const complex = await this.complexesRepository.findByPk(id);
    return complex;
  }

  async update(id: number, dto: UpdateComplexDto) {
    const complex = await this.complexesRepository.update(dto, {
      where: { id },
    });
    return complex;
  }

  async remove(id: number) {
    const response = await this.complexesRepository.destroy({ where: { id } });
    return response;
  }
}
