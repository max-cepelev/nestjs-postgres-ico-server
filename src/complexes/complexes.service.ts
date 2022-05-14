import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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
      ],
    });
    return data;
  }

  async create(dto: CreateComplexDto) {
    const complex = await this.complexesRepository.create(dto);
    return complex;
  }

  async findAll() {
    const complexes = await this.complexesRepository.findAll({
      order: [['name', 'ASC']],
      include: { all: true },
    });
    return complexes;
  }

  async findAllByGroup(groupId: number | null) {
    const complexes = await this.complexesRepository.findAll({
      where: { groupId: groupId ? groupId : null },
      order: [['name', 'ASC']],
      include: { all: true },
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
