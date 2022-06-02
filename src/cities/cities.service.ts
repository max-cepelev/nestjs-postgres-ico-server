import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Region } from 'src/regions/entities/region.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(@InjectModel(City) private citiesRepository: typeof City) {}
  async create(dto: CreateCityDto) {
    return await this.citiesRepository.create(dto);
  }

  async findAll(regionId?: number) {
    return await this.citiesRepository.findAll({
      where: regionId ? { regionId } : undefined,
      include: [Region],
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number) {
    return await this.citiesRepository.findByPk(id);
  }

  async update(id: number, dto: UpdateCityDto) {
    return await this.citiesRepository.update(dto, { where: { id } });
  }

  async remove(id: number) {
    return await this.citiesRepository.destroy({ where: { id } });
  }
}
