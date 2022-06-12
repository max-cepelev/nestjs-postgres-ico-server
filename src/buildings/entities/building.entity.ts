import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Area } from 'src/areas/entities/area.entity';
import { City } from 'src/cities/entities/city.entity';
import { Complex } from 'src/complexes/entities/complex.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Property } from 'src/properties/entities/property.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { CreateBuildingDto } from '../dto/create-building-dto';

@Table({ tableName: 'buildings' })
export class Building extends Model<Building, CreateBuildingDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING })
  address: string;

  @Column({ type: DataType.DATE })
  commissioningDate: Date;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  commissioned: boolean;

  @Column({ type: DataType.STRING })
  propertyClass: string;

  @Column({ type: DataType.STRING })
  wallMaterial: string;

  @Column({ type: DataType.STRING })
  decorType: string;

  @Column({ type: DataType.INTEGER })
  passengerElevators: number;

  @Column({ type: DataType.INTEGER })
  freightElevators: number;

  @Column({ type: DataType.FLOAT })
  latitude: number;

  @Column({ type: DataType.FLOAT })
  longitude: number;

  @Column({ type: DataType.STRING })
  img: string;

  @Column({ type: DataType.INTEGER })
  domRfId: number;

  @Column({ type: DataType.INTEGER })
  domClickId: number;

  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER, allowNull: false })
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @ForeignKey(() => Area)
  @Column({ type: DataType.INTEGER, allowNull: false })
  areaId: number;

  @BelongsTo(() => Area)
  area: Area;

  @ForeignKey(() => Group)
  @Column({ type: DataType.INTEGER, allowNull: false })
  groupId: number;

  @BelongsTo(() => Group)
  group: Group;

  @ForeignKey(() => Developer)
  @Column({ type: DataType.INTEGER, allowNull: false })
  developerId: number;

  @BelongsTo(() => Developer)
  developer: Developer;

  @ForeignKey(() => Complex)
  @Column({ type: DataType.INTEGER, allowNull: false })
  complexId: number;

  @BelongsTo(() => Complex)
  complex: Complex;

  @HasMany(() => Sale)
  sales: Sale[];

  @HasMany(() => Property)
  properties: Property[];
}
