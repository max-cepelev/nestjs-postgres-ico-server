import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { FindAttributeOptions, Op } from 'sequelize';
import { getNumArray } from 'src/helpers/numberArrayGenerator';
import { CreateOfferDto } from './dto/create-offer-dto';
import { UpdateOfferDto } from './dto/update-offer-dto';
import { Offer } from './entities/offers.entity';

const attributes: FindAttributeOptions = [
  [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice'],
  [sequelize.fn('MIN', sequelize.col('price')), 'minPrice'],
  [sequelize.fn('MAX', sequelize.col('price')), 'maxPrice'],
  [sequelize.fn('AVG', sequelize.col('totalArea')), 'avgArea'],
  [sequelize.fn('MIN', sequelize.col('totalArea')), 'minArea'],
  [sequelize.fn('MAX', sequelize.col('totalArea')), 'maxArea'],
  [sequelize.fn('MIN', sequelize.col('floor')), 'minFloor'],
  [sequelize.fn('MAX', sequelize.col('floor')), 'maxFloor'],
];

const oneRoomParams = getNumArray(25, 55, 5);
const twoRoomParams = getNumArray(40, 70, 5);
const threeRoomParams = getNumArray(60, 90, 5);
const fourRoomParams = getNumArray(75, 105, 5);
const allParams = getNumArray(25, 90, 5);

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer) private offersRepository: typeof Offer, // @InjectBrowser() private readonly browser: Browser,
  ) {}

  async getData(
    arr: number[],
    roomsAmount: sequelize.WhereAttributeHashValue<number>,
    id: number,
    column: keyof Offer,
  ) {
    const data = [];
    for (const param of arr) {
      if (param === arr[0]) {
        const resultCount = await this.offersRepository.count({
          where: { [column]: id, roomsAmount, totalArea: { [Op.lt]: arr[1] } },
        });
        const result =
          resultCount > 0 &&
          (await this.offersRepository.findAll({
            where: {
              [column]: id,
              roomsAmount,
              totalArea: { [Op.lte]: arr[1] },
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
            roomsAmount,
            totalArea: { [Op.gt]: arr[arr.length - 1] },
          },
        });
        const result =
          resultCount > 0 &&
          (await this.offersRepository.findAll({
            where: {
              [column]: id,
              roomsAmount,
              totalArea: { [Op.gt]: arr[arr.length - 1] },
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
            roomsAmount,
            totalArea: { [Op.between]: [param, param + 5] },
          },
        });
        const result =
          resultCount > 0 &&
          (await this.offersRepository.findAll({
            where: {
              [column]: id,
              roomsAmount,
              totalArea: { [Op.between]: [param, param + 5] },
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

  async bulkCreate(dto: CreateOfferDto[]) {
    const offers = await this.offersRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'image',
        'developer',
        'complex',
        'complexId',
        'building',
        'buildingId',
        'address',
        'commissioningDate',
        'price',
        'totalArea',
        'floor',
        'floorsAmount',
        'roomsAmount',
        'complexUrl',
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

  async findDataByBuildings(buildingIds: number[]) {
    const result: any[] = [];
    const column = 'buildingId';

    for (const buildingId of buildingIds) {
      const offer = await this.offersRepository.findOne({
        where: { buildingId },
      });
      const oneRoomOffers = await this.offersRepository.count({
        where: { buildingId, roomsAmount: { [Op.or]: [0, 1] } },
      });
      const twoRoomOffers = await this.offersRepository.count({
        where: { buildingId, roomsAmount: 2 },
      });
      const threeRoomOffers = await this.offersRepository.count({
        where: { buildingId, roomsAmount: 3 },
      });
      const fourRoomOffers = await this.offersRepository.count({
        where: { buildingId, roomsAmount: 4 },
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
        floorsAmount: offer.floorsAmount,
        commissioningDate: offer.commissioningDate,
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
        where: { buildingId, roomsAmount: { [Op.or]: [0, 1] } },
      });
      const twoRoomOffers = await this.offersRepository.count({
        where: { buildingId, roomsAmount: 2 },
      });
      const threeRoomOffers = await this.offersRepository.count({
        where: { buildingId, roomsAmount: 3 },
      });
      const fourRoomOffers = await this.offersRepository.count({
        where: { buildingId, roomsAmount: 4 },
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
        floorsAmount: offer.floorsAmount,
        commissioningDate: offer.commissioningDate,
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
        where: { complexId, roomsAmount: { [Op.or]: [0, 1] } },
      });
      const twoRoomOffers = await this.offersRepository.count({
        where: { complexId, roomsAmount: 2 },
      });
      const threeRoomOffers = await this.offersRepository.count({
        where: { complexId, roomsAmount: 3 },
      });
      const fourRoomOffers = await this.offersRepository.count({
        where: { complexId, roomsAmount: 4 },
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
        floorsAmount: offer.floorsAmount,
        commissioningDate: offer.commissioningDate,
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
