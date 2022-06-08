import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, {
  Op,
  WhereAttributeHashValue,
  WhereOptions,
} from 'sequelize';
import { getNumArray } from 'src/helpers/numberArrayGenerator';
import { CreateOfferDto } from './dto/create-offer-dto';
import { UpdateOfferDto } from './dto/update-offer-dto';
import { Offer } from './entities/offers.entity';

const allParams = getNumArray(25, 105, 5);

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer) private offersRepository: typeof Offer, // @InjectBrowser() private  browser: Browser,
  ) {}

  async getBuildingsData(buildings: { id: number; name: string }[]) {
    const data = [];
    for (const building of buildings) {
      if (building.id) {
        const buildingId = building.id;
        const offer = await this.offersRepository.findOne({
          where: { buildingId },
        });
        const oneRoomOffers = await this.offersRepository.count({
          where: { buildingId, rooms: { [Op.or]: [0, 1] } },
        });
        const twoRoomOffers = await this.offersRepository.count({
          where: { buildingId, rooms: 2 },
        });
        const threeRoomOffers = await this.offersRepository.count({
          where: { buildingId, rooms: 3 },
        });
        const fourRoomOffers = await this.offersRepository.count({
          where: { buildingId, rooms: 4 },
        });
        const actualDate = await this.offersRepository.max('updatedAt', {
          where: { buildingId },
        });
        data.push({
          id: buildingId,
          name: building.name,
          complex: offer ? offer.complex : '',
          building: offer ? offer.building : '',
          developer: offer ? offer.developer : '',
          address: offer ? offer.address : 'нет данных',
          floors: offer ? offer.floors : 'нет данных',
          image: offer ? offer.image : null,
          oneRoomOffers,
          twoRoomOffers,
          threeRoomOffers,
          fourRoomOffers,
          actualDate,
          totalOffers:
            oneRoomOffers + twoRoomOffers + threeRoomOffers + fourRoomOffers,
        });
      }
    }
    return data;
  }

  async getAnalysisData(buildings: { id: number; name: string }[]) {
    const analysisData: any[] = [];

    for (const param of allParams) {
      let name: string;
      let area: WhereAttributeHashValue<number>;
      if (param === 0) {
        name = `0 - ${allParams[1]}`;
        area = { [Op.lt]: allParams[1] };
      } else if (param === allParams[allParams.length - 1]) {
        name = `${param}+`;
        area = { [Op.gt]: allParams[allParams.length - 1] };
      } else {
        name = `${param} - ${param + 5}`;
        area = { [Op.between]: [param, param + 5] };
      }

      let res = { name };

      for (const building of buildings) {
        const buildingId = building.id;
        const resultCount = await this.offersRepository.count({
          where: {
            buildingId,
            area,
          },
        });
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;
        if (resultCount > 0) {
          count1 = await this.offersRepository.count({
            where: { buildingId, area, rooms: { [Op.or]: [0, 1] } },
          });
          count2 = await this.offersRepository.count({
            where: { buildingId, area, rooms: 2 },
          });
          count3 = await this.offersRepository.count({
            where: { buildingId, area, rooms: 3 },
          });
          count4 = await this.offersRepository.count({
            where: { buildingId, area, rooms: 4 },
          });
        }
        const result =
          resultCount > 0 &&
          (await this.offersRepository.findAll({
            where: {
              buildingId,
              area,
            },
            attributes: [
              [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice'],
              [sequelize.fn('MIN', sequelize.col('price')), 'minPrice'],
              [sequelize.fn('MAX', sequelize.col('price')), 'maxPrice'],
              [sequelize.fn('MIN', sequelize.col('floor')), 'minFloor'],
              [sequelize.fn('MAX', sequelize.col('floor')), 'maxFloor'],
              [sequelize.fn('MAX', sequelize.col('floors')), 'floors'],
            ],
          }));
        res = {
          ...res,
          [buildingId]: {
            data: resultCount > 0 ? result[0] : null,
            count: resultCount,
            count1,
            count2,
            count3,
            count4,
          },
        };
      }
      analysisData.push(res);
    }
    const buildingsData = await this.getBuildingsData(buildings);

    return { analysisData, buildings: buildingsData };
  }

  async getAreaAnalitics(buildingIds: number[]) {
    const analysisData: any[] = [];
    console.log(buildingIds);

    for (const param of allParams) {
      let name: string;
      let area: WhereAttributeHashValue<number>;
      if (param === 0) {
        name = `0 - ${allParams[1]}`;
        area = { [Op.lt]: allParams[1] };
      } else if (param === allParams[allParams.length - 1]) {
        name = `${param}+`;
        area = { [Op.gt]: allParams[allParams.length - 1] };
      } else {
        name = `${param} - ${param + 5}`;
        area = { [Op.between]: [param, param + 5] };
      }

      const where: WhereOptions<Offer> = {
        buildingId: { [Op.or]: buildingIds },
        area,
      };

      const data = await this.offersRepository.findOne({
        where,
        attributes: [
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice'],
          [sequelize.fn('AVG', sequelize.col('area')), 'avgArea'],
          [sequelize.fn('MIN', sequelize.col('price')), 'minPrice'],
          [sequelize.fn('MAX', sequelize.col('price')), 'maxPrice'],
          [sequelize.fn('MIN', sequelize.col('floor')), 'minFloor'],
          [sequelize.fn('MAX', sequelize.col('floor')), 'maxFloor'],
        ],
      });
      const count1 = await this.offersRepository.count({
        where: {
          ...where,
          rooms: { [Op.or]: [0, 1] },
        },
      });
      const count2 = await this.offersRepository.count({
        where: { ...where, rooms: 2 },
      });
      const count3 = await this.offersRepository.count({
        where: { ...where, rooms: 3 },
      });
      const count4 = await this.offersRepository.count({
        where: { ...where, rooms: 4 },
      });

      analysisData.push({
        name,
        data,
        count1,
        count2,
        count3,
        count4,
      });
    }

    return analysisData;
  }

  async bulkCreate(dto: CreateOfferDto[]) {
    const offers = await this.offersRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'floor',
        'floors',
        'price',
        'address',
        'buildingId',
        'building',
        'developer',
        'developerId',
        'complex',
        'complexId',
        'area',
        'rooms',
        'image',
      ],
    });
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

  async removeAll() {
    const response = await this.offersRepository.truncate();
    return response;
  }
}
