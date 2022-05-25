import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { Complex } from 'src/complexes/entities/complex.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { FilesService } from 'src/files/files.service';
import { Sale } from 'src/sales/entities/sale.entity';
import { CreateBuildingDto } from './dto/create-building-dto';
import { UpdateBuildingDto } from './dto/update-building-dto';
import { Building } from './entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectModel(Building) private buildingRepository: typeof Building,
    private fileService: FilesService,
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
        'floors',
        'entrances',
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
      ],
    });

    return data;
  }

  async create(dto: CreateBuildingDto) {
    const response = await this.buildingRepository.create(dto);
    return response;
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

  async findAll(complexId?: number, page?: number) {
    const options: FindOptions<Building> = {
      include: [Complex, Developer],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['name', 'ASC']],
      limit: page ? 15 : undefined,
      offset: page ? (page - 1) * 15 : undefined,
      where: complexId ? { complexId } : undefined,
    };
    const total = await this.buildingRepository.count({
      where: complexId ? { complexId } : undefined,
    });
    const response = await this.buildingRepository.findAll(options);
    return { buildings: response, total };
  }

  async findAllWithSales() {
    const response = await this.buildingRepository.findAll({
      include: [Complex, Sale],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [
        ['name', 'ASC'],
        [{ model: Sale, as: 'sales' }, 'date', 'ASC'],
      ],
    });
    return response;
  }

  async findOne(id: number) {
    const response = await this.buildingRepository.findByPk(id, {
      include: { all: true },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [[{ model: Sale, as: 'sales' }, 'date', 'ASC']],
    });
    return response;
  }

  async update(id: number, dto: UpdateBuildingDto) {
    const response = await this.buildingRepository.update(dto, {
      where: { id },
    });
    return response;
  }

  async remove(id: number) {
    const response = await this.buildingRepository.destroy({ where: { id } });
    return response;
  }

  async getDynamicsByBuilding(buildingId: number) {
    const data = await this.buildingRepository.findOne({
      where: { id: buildingId },
      include: [Sale, Complex],
      order: [[{ model: Sale, as: 'sales' }, 'date', 'ASC']],
    });

    return data;
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
