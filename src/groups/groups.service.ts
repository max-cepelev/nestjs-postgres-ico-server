import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Building } from 'src/buildings/entities/building.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { PropertiesService } from 'src/properties/properties.service';
import { CreateGroupDto } from './dto/create-group-dto';
import { UpdateGroupDto } from './dto/update-group-dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group) private groupsRepository: typeof Group,
    private propertiesService: PropertiesService,
  ) {}

  async bulkCreate(dto: CreateGroupDto[]) {
    const data = await this.groupsRepository.bulkCreate(dto, {
      updateOnDuplicate: ['name', 'regions'],
    });
    return data;
  }

  async create(dto: CreateGroupDto) {
    const group = await this.groupsRepository.create(dto);
    return group;
  }

  async findAll() {
    const groups = await this.groupsRepository.findAll({
      order: [['name', 'ASC']],
    });
    return groups;
  }

  async findAllWithAnalitics() {
    const data = await this.groupsRepository
      .findAll({
        include: [{ model: Developer, include: [Building] }],
      })
      .then(async (groups) => {
        const groupsData = [];
        for (const group of groups) {
          const buildingIds = [];
          for (const developer of group.developers) {
            for (const building of developer.buildings) {
              buildingIds.push(building.id);
            }
          }
          const analitics = await this.propertiesService.getBuildingsAnalytics(
            buildingIds,
          );
          groupsData.push({ name: group.name, analitics });
        }
        return groupsData;
      });
    return data;
  }

  async findOne(id: number) {
    const group = await this.groupsRepository.findByPk(id);
    return group;
  }

  async update(id: number, dto: UpdateGroupDto) {
    const group = await this.groupsRepository.update(dto, {
      where: { id },
    });
    return group;
  }

  async remove(id: number) {
    const response = await this.groupsRepository.destroy({ where: { id } });
    return response;
  }
}
