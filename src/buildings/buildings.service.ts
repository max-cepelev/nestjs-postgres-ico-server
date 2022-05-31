import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, WhereOptions } from 'sequelize';
import { Area } from 'src/areas/entities/area.entity';
import { City } from 'src/cities/entities/city.entity';
import { Complex } from 'src/complexes/entities/complex.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { FilesService } from 'src/files/files.service';
import { Property } from 'src/properties/entities/property.entity';
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

  async findOne(id: number) {
    const response = await this.buildingRepository.findByPk(id, {
      include: [Complex, Developer, City, Area, Sale],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [[{ model: Sale, as: 'sales' }, 'date', 'ASC']],
    });
    return response;
  }

  async findOneWithProperties(id: number) {
    const response = await this.buildingRepository.findByPk(id, {
      include: [Complex, City, Property],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return response;
  }

  async findAll(complexId?: number, cityId?: number, page?: number) {
    let where: WhereOptions<Building> = undefined;
    if (complexId && cityId) {
      where = { complexId, cityId };
    } else if (complexId) {
      where = { complexId };
    } else if (cityId) {
      where = { cityId };
    }

    const options: FindOptions<Building> = {
      include: [Complex, Developer],
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

  async findAllWithSales(cityId?: number) {
    const response = await this.buildingRepository.findAll({
      where: cityId ? { cityId } : undefined,
      include: [Complex, Sale],
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      order: [
        ['name', 'ASC'],
        [{ model: Sale, as: 'sales' }, 'date', 'ASC'],
      ],
    });
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

  async getDynamicsByComplex(complexId: number) {
    const data = await this.buildingRepository.findAll({
      where: { complexId },
      include: [Sale, Complex],
      order: [[{ model: Sale, as: 'sales' }, 'date', 'ASC']],
    });

    return data;
  }
}
