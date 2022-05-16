import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Complex } from 'src/complexes/entities/complex.entity';
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
        'floorsAmount',
        'apartmentsAmount',
        'livingSpace',
        'wallHeight',
        'entrancesAmount',
        'passengerElevatorsAmount',
        'freightElevatorsAmount',
        'nonLivingRoomsAmount',
        'parkingLotsAmount',
        'latitude',
        'longitude',
        'img',
        'domRfId',
        'domClickId',
        'complexId',
        'developerId',
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

  async findAll(complexId?: number) {
    if (complexId) {
      const response = await this.buildingRepository.findAll({
        where: { complexId },
        include: { model: Complex },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: [['name', 'ASC']],
      });
      return response;
    }
    const response = await this.buildingRepository.findAll({
      include: { model: Complex },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['name', 'ASC']],
    });
    return response;
  }

  async findAllWithSales() {
    const response = await this.buildingRepository.findAll({
      include: [Complex, Sale],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [['name', 'ASC']],
    });
    return response;
  }

  async findOne(id: number) {
    const response = await this.buildingRepository.findByPk(id, {
      include: { model: Complex },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
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
