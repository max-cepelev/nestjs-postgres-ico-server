import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/roles/entities/roles.entity';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async create(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async findAll() {
    const users = await this.userRepository.findAll({
      include: {
        model: Role,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      attributes: {
        exclude: ['password', 'roleId', 'createdAt', 'updatedAt'],
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findByPk(id, {
      include: {
        model: Role,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      attributes: {
        exclude: [
          'activationLink',
          'password',
          'roleId',
          'createdAt',
          'updatedAt',
        ],
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: {
        model: Role,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      attributes: {
        exclude: ['roleId', 'activationLink', 'createdAt', 'updatedAt'],
      },
    });
    return user;
  }

  async findByActivationLink(activationLink: string) {
    const user = await this.userRepository.findOne({
      where: { activationLink },
      include: {
        model: Role,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.update(dto, {
      where: { id },
    });
    return user;
  }

  async remove(id: number) {
    const response = await this.userRepository.destroy({ where: { id } });
    return response;
  }
}
