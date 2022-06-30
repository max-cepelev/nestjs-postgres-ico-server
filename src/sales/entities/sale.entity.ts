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
import { CreateSaleDto } from '../dto/create-sale-dto';

@Table({ tableName: 'sales' })
export class Sale extends Model<Sale, CreateSaleDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.DATE, allowNull: false })
  date: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  number: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  area: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

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
