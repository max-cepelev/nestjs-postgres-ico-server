import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Building } from 'src/buildings/entities/building.entity';
import { Complex } from 'src/complexes/entities/complex.entity';
import { Developer } from '../../developers/entities/developer.entity';
import { CreateGroupDto } from '../dto/create-group-dto';

@Table({ tableName: 'groups' })
export class Group extends Model<Group, CreateGroupDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING })
  regions: string;

  @HasMany(() => Building)
  buildings: Building[];

  @HasMany(() => Developer)
  developers: Developer[];

  @HasMany(() => Complex)
  complexes: Complex[];
}
