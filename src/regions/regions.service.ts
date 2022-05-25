import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  constructor(@InjectModel(Region) private regionsRepository: typeof Region) {}
  async create(dto: CreateRegionDto) {
    return await this.regionsRepository.create(dto);
  }

  async findAll() {
    return await this.regionsRepository.findAll();
  }

  async findOne(id: number) {
    return await this.regionsRepository.findByPk(id);
  }

  async update(id: number, dto: UpdateRegionDto) {
    return await this.regionsRepository.update(dto, { where: { id } });
  }

  async remove(id: number) {
    return await this.regionsRepository.destroy({ where: { id } });
  }
}
