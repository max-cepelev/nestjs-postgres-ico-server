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
    const developer = await this.developersRepository.create(dto);
    return developer;
  }

  async findAll() {
    const developers = await this.developersRepository.findAll({
      order: [['name', 'ASC']],
    });
    return developers;
  }

  async findAllByGroup(groupId: number | null) {
    const developers = await this.developersRepository.findAll({
      where: { groupId: groupId ? groupId : null },
      include: { all: true },
      order: [['name', 'ASC']],
    });
    return developers;
  }

  async findOne(id: number) {
    const developer = await this.developersRepository.findByPk(id);
    return developer;
  }

  async update(id: number, dto: UpdateDeveloperDto) {
    const developer = await this.developersRepository.update(dto, {
      where: { id },
    });
    return developer;
  }

  async remove(id: number) {
    const response = await this.developersRepository.destroy({ where: { id } });
    return response;
  }
}
