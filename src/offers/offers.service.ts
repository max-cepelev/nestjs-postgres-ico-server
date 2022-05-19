import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, {
  FindAttributeOptions,
  Op,
  WhereAttributeHashValue,
} from 'sequelize';
import { getNumArray } from 'src/helpers/numberArrayGenerator';
import { CreateOfferDto } from './dto/create-offer-dto';
import { UpdateOfferDto } from './dto/update-offer-dto';
import { Offer } from './entities/offers.entity';

const attributes: FindAttributeOptions = [
  [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice'],
  [sequelize.fn('MIN', sequelize.col('price')), 'minPrice'],
  [sequelize.fn('MAX', sequelize.col('price')), 'maxPrice'],
  [sequelize.fn('AVG', sequelize.col('area')), 'avgArea'],
  [sequelize.fn('MIN', sequelize.col('area')), 'minArea'],
  [sequelize.fn('MAX', sequelize.col('area')), 'maxArea'],
  [sequelize.fn('MIN', sequelize.col('floor')), 'minFloor'],
  [sequelize.fn('MAX', sequelize.col('floor')), 'maxFloor'],
];

const oneRoomParams = getNumArray(25, 55, 5);
const twoRoomParams = getNumArray(40, 70, 5);
const threeRoomParams = getNumArray(60, 90, 5);
const fourRoomParams = getNumArray(75, 105, 5);
const allParams = getNumArray(25, 110, 5);

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer) private offersRepository: typeof Offer, // @InjectBrowser() private  browser: Browser,
  ) {}

  async getBuildingsData(buildingIds: number[]) {
    const buildings = [];
    for (const buildingId of buildingIds) {
      if (buildingId) {
        const offer = await this.offersRepository.findOne({
          where: { buildingId },
        });
        if (offer) {
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
          buildings.push({
            id: buildingId,
            complex: offer.complex,
            building: offer.building,
            developer: offer.developer,
            address: offer.address,
            floors: offer.floors,
            image: offer.image,
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
    }
    return buildings;
  }

  async getData(
    arr: number[],
    rooms: sequelize.WhereAttributeHashValue<number>,
    id: number,
    column: keyof Offer,
  ) {
    const data = [];
    for (const param of arr) {
      if (param === arr[0]) {
        const resultCount = await this.offersRepository.count({
          where: { [column]: id, rooms, area: { [Op.lt]: arr[1] } },
        });
        const result =
          resultCount > 0 &&
          (await this.offersRepository.findAll({
            where: {
              [column]: id,
              rooms,
              area: { [Op.lte]: arr[1] },
            },
            attributes,
          }));
        data.push({
          title: `Площадь до ${arr[1]}`,
          data: resultCount > 0 ? result[0] : null,
          count: resultCount,
        });
      } else if (param === arr[arr.length - 1]) {
        const resultCount = await this.offersRepository.count({
          where: {
            [column]: id,
            rooms,
            area: { [Op.gt]: arr[arr.length - 1] },
          },
        });
        const result =
          resultCount > 0 &&
          (await this.offersRepository.findAll({
            where: {
              [column]: id,
              rooms,
              area: { [Op.gt]: arr[arr.length - 1] },
            },
            attributes,
          }));
        data.push({
          title: `Площадь от ${arr[arr.length - 1]}`,
          data: resultCount > 0 ? result[0] : null,
          count: resultCount,
        });
      } else {
        const resultCount = await this.offersRepository.count({
          where: {
            [column]: id,
            rooms,
            area: { [Op.between]: [param, param + 5] },
          },
        });
        const result =
          resultCount > 0 &&
          (await this.offersRepository.findAll({
            where: {
              [column]: id,
              rooms,
              area: { [Op.between]: [param, param + 5] },
            },
            attributes,
          }));
        data.push({
          title: `Площадь от ${param} до ${param + 5}`,
          data: resultCount > 0 ? result[0] : null,
          count: resultCount,
        });
      }
    }
    return data;
  }

  async findDataByBuildings(buildingIds: number[]) {
    const result: any[] = [];
    const column = 'buildingId';

    for (const buildingId of buildingIds) {
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
      const data = await this.getData(
        allParams,
        { [Op.or]: [0, 1, 2, 3, 4] },
        buildingId,
        column,
      );
      result.push({
        complex: offer.complex,
        building: offer.building,
        address: offer.address,
        floors: offer.floors,
        image: offer.image,
        oneRoomOffers,
        twoRoomOffers,
        threeRoomOffers,
        fourRoomOffers,
        actualDate,
        totalOffers:
          oneRoomOffers + twoRoomOffers + threeRoomOffers + fourRoomOffers,
        offers: data,
      });
    }
    return result;
  }

  async findSpacesByBuildings(buildingIds: number[]) {
    const result: any[] = [];
    const column = 'buildingId';

    for (const buildingId of buildingIds) {
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
      const oneRoomData = await this.getData(
        oneRoomParams,
        { [Op.or]: [0, 1] },
        buildingId,
        column,
      );
      const twoRoomData = await this.getData(
        twoRoomParams,
        2,
        buildingId,
        column,
      );
      const threeRoomData = await this.getData(
        threeRoomParams,
        3,
        buildingId,
        column,
      );
      const fourRoomData = await this.getData(
        fourRoomParams,
        4,
        buildingId,
        column,
      );
      result.push({
        complex: offer.complex,
        building: offer.building,
        address: offer.address,
        floors: offer.floors,
        image: offer.image,
        oneRoomOffers,
        twoRoomOffers,
        threeRoomOffers,
        fourRoomOffers,
        actualDate,
        totalOffers:
          oneRoomOffers + twoRoomOffers + threeRoomOffers + fourRoomOffers,
        offers: {
          room_1: oneRoomData,
          room_2: twoRoomData,
          room_3: threeRoomData,
          room_4: fourRoomData,
        },
      });
    }
    return result;
  }

  async findSpacesByComplexes(complexesIds: number[]) {
    const result: any[] = [];
    const column = 'complexId';

    for (const complexId of complexesIds) {
      const offer = await this.offersRepository.findOne({
        where: { complexId },
      });
      const oneRoomOffers = await this.offersRepository.count({
        where: { complexId, rooms: { [Op.or]: [0, 1] } },
      });
      const twoRoomOffers = await this.offersRepository.count({
        where: { complexId, rooms: 2 },
      });
      const threeRoomOffers = await this.offersRepository.count({
        where: { complexId, rooms: 3 },
      });
      const fourRoomOffers = await this.offersRepository.count({
        where: { complexId, rooms: 4 },
      });
      const actualDate = await this.offersRepository.max('updatedAt', {
        where: { complexId },
      });
      const oneRoomData = await this.getData(
        oneRoomParams,
        { [Op.or]: [0, 1] },
        complexId,
        column,
      );
      const twoRoomData = await this.getData(
        twoRoomParams,
        2,
        complexId,
        column,
      );
      const threeRoomData = await this.getData(
        threeRoomParams,
        3,
        complexId,
        column,
      );
      const fourRoomData = await this.getData(
        fourRoomParams,
        4,
        complexId,
        column,
      );
      result.push({
        complex: offer.complex,
        building: offer.building,
        address: offer.address,
        floors: offer.floors,
        image: offer.image,
        oneRoomOffers,
        twoRoomOffers,
        threeRoomOffers,
        fourRoomOffers,
        actualDate,
        totalOffers:
          oneRoomOffers + twoRoomOffers + threeRoomOffers + fourRoomOffers,
        offers: {
          room_1: oneRoomData,
          room_2: twoRoomData,
          room_3: threeRoomData,
          room_4: fourRoomData,
        },
      });
    }
    return result;
  }

  async getAnalysisData(buildingIds: number[]) {
    const analysisData: any[] = [];

    for (const param of allParams) {
      let name: string;
      let area: WhereAttributeHashValue<number>;
      if (param === allParams[0]) {
        name = `0 - ${param}`;
        area = { [Op.lt]: allParams[1] };
      } else if (param === allParams[allParams.length - 1]) {
        name = `${param}+`;
        area = { [Op.gt]: allParams[allParams.length - 1] };
      } else {
        name = `${param} - ${param + 5}`;
        area = { [Op.between]: [param, param + 5] };
      }
      let res = { name };
      for (const buildingId of buildingIds) {
        if (buildingId) {
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
          const result = resultCount > 0 &&
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
          analysisData.push(res);
          };
        }
      }
    }

    const buildings = await this.getBuildingsData(buildingIds);

    return { analysisData, buildings };
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
}
