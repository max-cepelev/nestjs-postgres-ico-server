import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { PropertyType } from './entities/property-type.entity';

@Injectable()
export class PropertyTypesService {
  constructor(
    @InjectModel(PropertyType)
    private propertyTypesRepository: typeof PropertyType,
  ) {}
  async create(dto: CreatePropertyTypeDto) {
    return await this.propertyTypesRepository.create(dto);
  }

  async findAll() {
    return await this.propertyTypesRepository.findAll();
  }

  async findOne(id: number) {
    return await this.propertyTypesRepository.findByPk(id);
  }

  async update(id: number, dto: UpdatePropertyTypeDto) {
    return await this.propertyTypesRepository.update(dto, { where: { id } });
  }

  async remove(id: number) {
    return await this.propertyTypesRepository.destroy({ where: { id } });
  }
}
