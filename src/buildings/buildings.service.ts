import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Area } from 'src/areas/entities/area.entity';
import { City } from 'src/cities/entities/city.entity';
import { Complex } from 'src/complexes/entities/complex.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { FilesService } from 'src/files/files.service';
import { Group } from 'src/groups/entities/group.entity';
import { Property } from 'src/properties/entities/property.entity';
import { PropertiesService } from 'src/properties/properties.service';
import { Region } from 'src/regions/entities/region.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { SalesService } from 'src/sales/sales.service';
import { CreateBuildingDto } from './dto/create-building-dto';
import { UpdateBuildingDto } from './dto/update-building-dto';
import { Building } from './entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectModel(Building) private buildingRepository: typeof Building,
    private fileService: FilesService,
    private propertiesService: PropertiesService,
    private salesService: SalesService,
  ) {}

  async bulkCreate(dto: CreateBuildingDto[]) {
    const data = await this.buildingRepository.bulkCreate(dto, {
      updateOnDuplicate: [
        'name',
        'address',
        'commissioningDate',
        'commissioned',
        'propertyClass',
        'wallMaterial',
        'decorType',
        'passengerElevators',
        'freightElevators',
        'latitude',
        'longitude',
        'img',
        'domRfId',
        'domClickId',
        'complexId',
        'developerId',
        'cityId',
        'groupId',
        'areaId',
      ],
    });

    return data;
  }

  async create(dto: CreateBuildingDto, img?: File) {
    const fileName = img ? await this.fileService.createFile(img) : null;
    const response = await this.buildingRepository.create({
      ...dto,
      img: fileName ?? null,
    });
    return response;
  }

  async update(id: number, dto: UpdateBuildingDto, img?: File) {
    const fileName = img ? await this.fileService.createFile(img) : null;
    const response = await this.buildingRepository.update(
      {
        ...dto,
        img: fileName ? fileName : dto.img,
      },
      {
        where: { id },
      },
    );
    return response;
  }

  async remove(id: number) {
    const response = await this.buildingRepository.destroy({ where: { id } });
    return response;
  }

  async findAll({
    complexId,
    cityId,
    areaId,
    inWork,
    page,
  }: {
    complexId?: number;
    cityId?: number;
    areaId?: number;
    inWork?: 1 | 0;
    page?: number;
  }) {
    const keys = [];
    inWork && keys.push({ commissioned: !Boolean(+inWork) });
    complexId && keys.push({ complexId });
    cityId && keys.push({ cityId });
    areaId && keys.push({ areaId });
    const where: WhereOptions<Building> = {
      [Op.and]: keys,
    };

    const options: FindOptions<Building> = {
      include: [Group, Complex, Developer],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['name', 'ASC']],
      limit: page ? 15 : undefined,
      offset: page ? (page - 1) * 15 : undefined,
      where,
    };

    const total = await this.buildingRepository.count({
      where,
    });

    const response = await this.buildingRepository.findAll(options);
    return { buildings: response, total };
  }

  async findOneWithSales(id: number) {
    const response = await this.buildingRepository.findByPk(id, {
      include: [Group, Complex, Sale],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [[{ model: Sale, as: 'sales' }, 'date', 'ASC']],
    });
    return response;
  }

  async findOneWithAnalitics(id: number) {
    const analitics = await this.propertiesService.getAnalytics(id);
    const lastSale = await this.salesService.findLastRecord(id);
    const response = await this.buildingRepository.findByPk(id, {
      include: [
        Complex,
        { model: Developer, include: [Group] },
        { model: City, include: [Region] },
        Area,
        Sale,
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [[{ model: Sale, as: 'sales' }, 'date', 'ASC']],
    });
    return { building: response, analitics, lastSale };
  }

  async findOneWithProperties(id: number) {
    const response = await this.buildingRepository.findByPk(id, {
      include: [Complex, Property],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [[{ model: Property, as: 'properties' }, 'number', 'ASC']],
    });
    return response;
  }

  async findAllWithSales(cityId?: number, areaId?: number) {
    const keys = [];
    cityId && keys.push({ cityId });
    areaId && keys.push({ areaId });
    const where: WhereOptions<Complex> = {
      [Op.and]: keys,
    };
    const response = await this.buildingRepository.findAll({
      where,
      include: [Complex, Sale],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [
        ['name', 'ASC'],
        [{ model: Sale, as: 'sales' }, 'date', 'ASC'],
      ],
    });
    return response;
  }

  async getBuildingCardData(id: number) {
    const numberLiving = await this.propertiesService.getPropCount(id);
    const lastSale = await this.salesService.findLastRecord(id);
    return { numberLiving, lastSale };
  }

  async uploadImage(id: string, img?: File) {
    const fileName = img ? await this.fileService.createFile(img) : null;
    const response = await this.buildingRepository.update(
      { img: fileName },
      {
        where: { id },
      },
    );
    return response;
  }

  async getDynamicsByComplex(complexId: number) {
    const data = await this.buildingRepository.findAll({
      where: { complexId },
      include: [Sale, Complex],
      order: [[{ model: Sale, as: 'sales' }, 'date', 'ASC']],
    });

    return data;
  }
}
