import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op } from 'sequelize';
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
        'date',
        'numberLiving',
        'areaLiving',
        'priceLiving',
        'numberNonResidental',
        'areaNonResidental',
        'priceNonResidental',
        'numberParkingSpace',
        'areaParkingSpace',
        'priceParkingSpace',
        'buildingId',
      ],
    });

    return data;
  }

  async create(dto: CreateSaleDto) {
    const sale = await this.salesRepository.create(dto);
    return sale;
  }

  async findAll(buildingId?: number) {
    const sales = await this.salesRepository.findAll({
      where: buildingId ? { buildingId } : undefined,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['date', 'ASC']],
    });
    return sales;
  }

  async getSalesAnalitics() {
    const now = new Date();
    const startDate = new Date(
      now.getFullYear() - 1,
      now.getMonth() - 1,
      now.getDay(),
    );
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDay());

    const data = [];
    while (startDate < endDate) {
      const sale = await this.salesRepository.findOne({
        where: {
          [Op.and]: [
            sequelize.where(
              sequelize.fn('DATE_PART', 'year', sequelize.col('date')),
              startDate.getFullYear(),
            ),
            sequelize.where(
              sequelize.fn('DATE_PART', 'month', sequelize.col('date')),
              startDate.getMonth() + 1,
            ),
          ],
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('numberLiving')), 'livingNumber'],
          [sequelize.fn('SUM', sequelize.col('areaLiving')), 'livingArea'],
          [sequelize.fn('SUM', sequelize.col('priceLiving')), 'livingPrice'],
          [
            sequelize.fn('SUM', sequelize.col('numberNonResidental')),
            'commercialNumber',
          ],
          [
            sequelize.fn('SUM', sequelize.col('areaNonResidental')),
            'commercialArea',
          ],
          [
            sequelize.fn('SUM', sequelize.col('priceNonResidental')),
            'commercialPrice',
          ],
          [
            sequelize.fn('SUM', sequelize.col('numberParkingSpace')),
            'parkingNumber',
          ],
          [
            sequelize.fn('SUM', sequelize.col('areaParkingSpace')),
            'parkingArea',
          ],
          [
            sequelize.fn('SUM', sequelize.col('priceParkingSpace')),
            'parkingPrice',
          ],
        ],
      });
      data.push({
        date: startDate.toISOString(),
        sale,
      });
      startDate.setMonth(startDate.getMonth() + 1);
    }
    return data;
  }

  async getGroupSales(date: string, buildingIds: number[]) {
    const dt = new Date(date);

    const sale = await this.salesRepository.findOne({
      where: {
        [Op.and]: [
          { buildingId: buildingIds },
          sequelize.where(
            sequelize.fn('DATE_PART', 'year', sequelize.col('date')),
            dt.getFullYear(),
          ),
          sequelize.where(
            sequelize.fn('DATE_PART', 'month', sequelize.col('date')),
            dt.getMonth() + 1,
          ),
        ],
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('numberLiving')), 'livingNumber'],
        [sequelize.fn('SUM', sequelize.col('areaLiving')), 'livingArea'],
        [sequelize.fn('SUM', sequelize.col('priceLiving')), 'livingPrice'],
        [
          sequelize.fn('SUM', sequelize.col('numberNonResidental')),
          'commercialNumber',
        ],
        [
          sequelize.fn('SUM', sequelize.col('areaNonResidental')),
          'commercialArea',
        ],
        [
          sequelize.fn('SUM', sequelize.col('priceNonResidental')),
          'commercialPrice',
        ],
        [
          sequelize.fn('SUM', sequelize.col('numberParkingSpace')),
          'parkingNumber',
        ],
        [sequelize.fn('SUM', sequelize.col('areaParkingSpace')), 'parkingArea'],
        [
          sequelize.fn('SUM', sequelize.col('priceParkingSpace')),
          'parkingPrice',
        ],
      ],
    });

    return sale;
  }

  async findLastRecord(buildingId: number) {
    const sales = await this.salesRepository.findOne({
      where: { buildingId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['date', 'DESC']],
    });
    return sales;
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
