import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role)
    private roleRepository: typeof Role,
  ) {}

  async createBulk(dto: CreateRoleDto[]) {
    const layout = await this.roleRepository.bulkCreate(dto);
    return layout;
  }

  async create(dto: CreateRoleDto) {
    const layout = await this.roleRepository.create(dto);
    return layout;
  }

  async findAll() {
    const layouts = await this.roleRepository.findAll();
    return layouts;
  }

  async findOne(id: number) {
    const layout = await this.roleRepository.findByPk(id);
    return layout;
  }

  async update(id: number, dto: any) {
    const layout = await this.roleRepository.update(dto, {
      where: { id },
    });
    return layout;
  }

  async remove(id: number) {
    const response = await this.roleRepository.destroy({
      where: { id },
    });
    return response;
  }
}
