import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Building } from 'src/buildings/entities/building.entity';
import { CreateSaleDto } from './dto/create-sale-dto';
import { UpdateSaleDto } from './dto/update-sale-dto';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale) private salesRepository: typeof Sale) {}

  async bulkCreate(dto: CreateSaleDto[]) {
    const data = await this.salesRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'numberLiving',
        'areaLiving',
        'priceLiving',
        'numberNonResidental',
        'areaNonResidental',
        'priceNonResidental',
        'numberParkingSpace',
        'areaParkingSpace',
        'priceParkingSpace',
      ],
    });

    return data;
  }

  async create(dto: CreateSaleDto) {
    const building = await this.salesRepository.create(dto);
    return building;
  }

  async findAll(buildingId?: number) {
    if (buildingId) {
      const buildings = await this.salesRepository.findAll({
        where: { buildingId },
        include: { model: Building },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['date', 'ASC']],
      });
      return buildings;
    }
    const buildings = await this.salesRepository.findAll({
      include: { model: Building },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['date', 'ASC']],
    });
    return buildings;
  }

  async findOne(id: number) {
    const building = await this.salesRepository.findByPk(id, {
      include: { model: Building },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return building;
  }

  async update(id: number, dto: UpdateSaleDto) {
    const building = await this.salesRepository.update(dto, {
      where: { id },
    });
    return building;
  }

  async remove(id: number) {
    const response = await this.salesRepository.destroy({ where: { id } });
    return response;
  }
}
