import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';

@Injectable()
export class AreasService {
  constructor(@InjectModel(Area) private areasRepository: typeof Area) {}

  async createBulk(dto: CreateAreaDto[]) {
    return await this.areasRepository.bulkCreate(dto);
  }

  async create(dto: CreateAreaDto) {
    return await this.areasRepository.create(dto);
  }

  async findAll(cityId?: number) {
    return await this.areasRepository.findAll({
      where: cityId ? { cityId } : undefined,
      include: { all: true },
    });
  }

  async findOne(id: number) {
    return await this.areasRepository.findByPk(id);
  }

  async update(id: number, dto: UpdateAreaDto) {
    return await this.areasRepository.update(dto, { where: { id } });
  }

  async remove(id: number) {
    return await this.areasRepository.destroy({ where: { id } });
  }
}
