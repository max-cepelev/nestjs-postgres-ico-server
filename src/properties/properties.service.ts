import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { FindAttributeOptions } from 'sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { PropertyType } from 'src/property-types/entities/property-type.entity';
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

  async createBulk(dto: CreatePropertyDto[]) {
    return await this.propertiesRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'number',
        'floor',
        'entrance',
        'totalArea',
        'livingArea',
        'rooms',
        'wallHeight',
      ],
    });
  }

  async findAll(buildingId?: number, propertyTypeId?: number) {
    let where: WhereOptions<Property> = undefined;
    if (buildingId && propertyTypeId) {
      where = { buildingId, propertyTypeId };
    } else if (buildingId) {
      where = { buildingId };
    } else if (propertyTypeId) {
      where = { propertyTypeId };
    }

    const options: FindOptions<Property> = {
      include: { model: PropertyType },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      where,
    };

    return await this.propertiesRepository.findAll(options);
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

  async getPropCount(buildingId: number) {
    return await this.propertiesRepository.count({
      where: { buildingId, propertyTypeId: 1 },
    });
  }

  async getAnalytics(buildingId: number) {
    const attributes: FindAttributeOptions = [
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('totalArea')), 'totalArea'],
      [sequelize.fn('AVG', sequelize.col('totalArea')), 'avgArea'],
      [sequelize.fn('MIN', sequelize.col('totalArea')), 'minArea'],
      [sequelize.fn('MAX', sequelize.col('totalArea')), 'maxArea'],
      [sequelize.fn('MIN', sequelize.col('wallHeight')), 'minWallHeight'],
      [sequelize.fn('MAX', sequelize.col('wallHeight')), 'maxWallHeight'],
    ];

    const oneRoom = await this.propertiesRepository.findOne({
      where: { buildingId, propertyTypeId: 1, rooms: 1 },
      attributes,
    });

    const twoRoom = await this.propertiesRepository.findOne({
      where: { buildingId, propertyTypeId: 1, rooms: 2 },
      attributes,
    });

    const threeRoom = await this.propertiesRepository.findOne({
      where: { buildingId, propertyTypeId: 1, rooms: 3 },
      attributes,
    });

    const fourRoom = await this.propertiesRepository.findOne({
      where: { buildingId, propertyTypeId: 1, rooms: 4 },
      attributes,
    });

    const commercial = await this.propertiesRepository.findOne({
      where: { buildingId, propertyTypeId: 2 },
      attributes,
    });

    const parking = await this.propertiesRepository.findOne({
      where: { buildingId, propertyTypeId: 3 },
      attributes,
    });
    return {
      living: {
        oneRoom,
        twoRoom,
        threeRoom,
        fourRoom,
      },
      commercial,
      parking,
    };
  }
}
