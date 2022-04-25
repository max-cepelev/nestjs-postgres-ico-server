import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateDeveloperDto } from './dto/create-developer-dto';
import { UpdateDeveloperDto } from './dto/update-developer-dto';
import { Developer } from './entities/developer.entity';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectModel(Developer) private developersRepository: typeof Developer,
  ) {}

  async bulkCreate(dto: CreateDeveloperDto[]) {
    const data = await this.developersRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'fullName',
        'legalAddress',
        'actualAddress',
        'inn',
        'kpp',
        'ogrn',
        'manager',
        'website',
        'phone',
        'email',
        'info',
        'groupId',
      ],
    });
    return data;
  }

  async create(dto: CreateDeveloperDto) {
    const complex = await this.developersRepository.create(dto);
    return complex;
  }

  async findAll() {
    const complexes = await this.developersRepository.findAll({
      order: [['name', 'ASC']],
    });
    return complexes;
  }

  async findOne(id: number) {
    const complex = await this.developersRepository.findByPk(id);
    return complex;
  }

  async update(id: number, dto: UpdateDeveloperDto) {
    const complex = await this.developersRepository.update(dto, {
      where: { id },
    });
    return complex;
  }

  async remove(id: number) {
    const response = await this.developersRepository.destroy({ where: { id } });
    return response;
  }
}
