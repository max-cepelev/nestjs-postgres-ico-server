import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Building } from 'src/buildings/entities/building.entity';
import { PropertyType } from 'src/property-types/entities/property-type.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';

@Table({ tableName: 'properties' })
export class Property extends Model<Property, CreatePropertyDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  number: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  floor: number;

  @Column({ type: DataType.INTEGER })
  entrance: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  totalArea: number;

  @Column({ type: DataType.FLOAT })
  livingArea: number;

  @Column({ type: DataType.INTEGER })
  rooms: number;

  @Column({ type: DataType.FLOAT })
  wallHeight: number;

  @ForeignKey(() => Building)
  @Column({ type: DataType.INTEGER, allowNull: false })
  buildingId: number;

  @ForeignKey(() => PropertyType)
  @Column({ type: DataType.INTEGER, allowNull: false })
  propertyTypeId: number;

  @BelongsTo(() => PropertyType)
  propertyType: PropertyType;

  @BelongsTo(() => Building)
  building: Building;
}
