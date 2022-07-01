import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { FindAttributeOptions, Op, WhereOptions } from 'sequelize';
import { Building } from 'src/buildings/entities/building.entity';
import { Property } from 'src/properties/entities/property.entity';
import { CreateSaleDto } from './dto/create-sale-dto';
import { UpdateSaleDto } from './dto/update-sale-dto';
import { Sale } from './entities/sale.entity';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale) private salesRepository: typeof Sale) {}

  async bulkCreate(dto: CreateSaleDto[]) {
    const data = await this.salesRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'date',
        'number',
        'area',
        'price',
        'propertyTypeId',
        'buildingId',
      ],
    });

    return data;
  }

  async create(dto: CreateSaleDto) {
    const sale = await this.salesRepository.create(dto);
    return sale;
  }

  async findAll(buildingId?: number, propertyTypeId?: number) {
    const keys = [];
    buildingId && keys.push({ buildingId });
    propertyTypeId && keys.push({ propertyTypeId });

    const where: WhereOptions<Property> = {
      [Op.and]: keys,
    };
    const sales = await this.salesRepository.findAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['date', 'ASC']],
    });
    return sales;
  }

  async getSalesAnalitics() {
    const lastRecord = await this.salesRepository.findOne({
      attributes: [[sequelize.fn('MAX', sequelize.col('date')), 'date']],
    });
    const now = lastRecord ? new Date(lastRecord.date) : new Date();
    const startDate = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDay(),
    );
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDay(),
    );

    const data = [];
    while (startDate < endDate) {
      const sales = await this.getSalesSum({ date: startDate });
      data.push({
        date: startDate.toISOString(),
        ...sales,
      });
      startDate.setMonth(startDate.getMonth() + 1);
    }
    return data;
  }

  async getSalesSum({
    buildingIds,
    date,
  }: { buildingIds?: number[]; date?: Date } | undefined) {
    const whereOptions: any[] = [];

    buildingIds && whereOptions.push({ buildingId: buildingIds });
    date &&
      whereOptions.push(
        sequelize.where(
          sequelize.fn('DATE_PART', 'year', sequelize.col('date')),
          date.getFullYear(),
        ),
        sequelize.where(
          sequelize.fn('DATE_PART', 'month', sequelize.col('date')),
          date.getMonth() + 1,
        ),
      );
    const attributes: FindAttributeOptions = [
      [sequelize.fn('SUM', sequelize.col('number')), 'number'],
      [sequelize.fn('SUM', sequelize.col('area')), 'area'],
      [sequelize.fn('SUM', sequelize.col('price')), 'price'],
    ];
    const living = await this.salesRepository.findOne({
      where: {
        [Op.and]: [{ propertyTypeId: 1 }, ...whereOptions],
      },
      attributes,
    });
    const commercial = await this.salesRepository.findOne({
      where: {
        [Op.and]: [{ propertyTypeId: 2 }, ...whereOptions],
      },
      attributes,
    });
    const parking = await this.salesRepository.findOne({
      where: {
        [Op.and]: [{ propertyTypeId: 3 }, ...whereOptions],
      },
      attributes,
    });

    return { living, commercial, parking };
  }

  async findOne(id: number) {
    const sale = await this.salesRepository.findByPk(id, {
      include: { model: Building },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return sale;
  }

  async update(id: number, dto: UpdateSaleDto) {
    const sale = await this.salesRepository.update(dto, {
      where: { id },
    });
    return sale;
  }

  async remove(id: number) {
    const response = await this.salesRepository.destroy({ where: { id } });
    return response;
  }
}
