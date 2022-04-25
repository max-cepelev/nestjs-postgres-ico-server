import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';
import { CreateOfferDto } from './dto/create-offer-dto';
import { UpdateOfferDto } from './dto/update-offer-dto';
import { Offer } from './entities/offers.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer) private offersRepository: typeof Offer, // @InjectBrowser() private readonly browser: Browser,
  ) {}
  async bulkCreate(dto: CreateOfferDto[]) {
    const offers = await this.offersRepository.bulkCreate(dto);
    return offers;
  }

  async create(dto: CreateOfferDto) {
    const offer = await this.offersRepository.create(dto);
    return offer;
  }

  async findAll() {
    const offers = await this.offersRepository.findAll();
    return offers;
  }

  async findAvarage(complexIds: number[], roomsAmount: number) {
    const result: any[] = [];
    for (const complexId of complexIds) {
      const res = await this.offersRepository.findAll({
        where: [{ complexId }, { roomsAmount }],
        attributes: [
          [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice'],
          [sequelize.fn('AVG', sequelize.col('totalArea')), 'avgTotalArea'],
        ],
      });
      result.push({ data: res[0], complexId, roomsAmount });
    }
    return result;
  }

  async findOne(id: number) {
    const offer = await this.offersRepository.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return offer;
  }

  async update(id: number, dto: UpdateOfferDto) {
    const offer = await this.offersRepository.update(dto, {
      where: { id },
    });
    return offer;
  }

  async remove(id: number) {
    const response = await this.offersRepository.destroy({ where: { id } });
    return response;
  }
}
