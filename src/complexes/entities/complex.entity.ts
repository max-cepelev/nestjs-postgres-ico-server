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
import { CreateComplexDto } from '../dto/create-complex-dto';

@Table({ tableName: 'complexes' })
export class Complex extends Model<Complex, CreateComplexDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING, unique: true })
  shortName: string;

  @Column({ type: DataType.STRING })
  website: string;

  @Column({ type: DataType.STRING })
  info: string;

  @Column({ type: DataType.INTEGER })
  domRfId: number;

  @Column({ type: DataType.INTEGER })
  domClickId: number;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @HasMany(() => Building)
  buildings: Building[];
}
