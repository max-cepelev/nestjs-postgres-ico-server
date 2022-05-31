import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Group } from 'src/groups/entities/group.entity';
import { Building } from '../../buildings/entities/building.entity';
import { CreateDeveloperDto } from '../dto/create-developer-dto';

@Table({ tableName: 'developers' })
export class Developer extends Model<Developer, CreateDeveloperDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @Column({ type: DataType.STRING })
  legalAddress: string;

  @Column({ type: DataType.STRING })
  actualAddress: string;

  @Column({ type: DataType.STRING, unique: true })
  inn: string;

  @Column({ type: DataType.STRING })
  kpp: string;

  @Column({ type: DataType.STRING })
  ogrn: string;

  @Column({ type: DataType.STRING })
  manager: string;

  @Column({ type: DataType.STRING })
  website: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  info: string;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => Building)
  buildings: Building[];
}
