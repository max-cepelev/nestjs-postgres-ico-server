import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateGroupDto } from './dto/create-group-dto';
import { UpdateGroupDto } from './dto/update-group-dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group) private groupsRepository: typeof Group) {}

  async bulkCreate(dto: CreateGroupDto[]) {
    const data = await this.groupsRepository.bulkCreate(dto, {
      updateOnDuplicate: ['name', 'regions'],
    });
    return data;
  }

  async create(dto: CreateGroupDto) {
    const complex = await this.groupsRepository.create(dto);
    return complex;
  }

  async findAll() {
    const complexes = await this.groupsRepository.findAll();
    return complexes;
  }

  async findOne(id: number) {
    const complex = await this.groupsRepository.findByPk(id);
    return complex;
  }

  async update(id: number, dto: UpdateGroupDto) {
    const complex = await this.groupsRepository.update(dto, {
      where: { id },
    });
    return complex;
  }

  async remove(id: number) {
    const response = await this.groupsRepository.destroy({ where: { id } });
    return response;
  }
}
