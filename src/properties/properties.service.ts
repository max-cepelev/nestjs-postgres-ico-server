import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property } from './entities/property.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property) private propertiesRepository: typeof Property,
  ) {}
  async create(dto: CreatePropertyDto) {
    return await this.propertiesRepository.create(dto);
  }

  async findAll(buildingId?: number, propertyTypeId?: number) {
    return await this.propertiesRepository.findAll({
      where: {
        buildingId: buildingId ?? undefined,
        propertyTypeId: propertyTypeId ?? undefined,
      },
      include: { all: true },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
  }

  async findOne(id: number) {
    return await this.propertiesRepository.findByPk(id);
  }

  async update(id: number, dto: UpdatePropertyDto) {
    return await this.propertiesRepository.update(dto, { where: { id } });
  }

  async remove(id: number) {
    return await this.propertiesRepository.destroy({ where: { id } });
  }
}
