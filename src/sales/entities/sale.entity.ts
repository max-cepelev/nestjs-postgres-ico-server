import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Building } from 'src/buildings/entities/building.entity';
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

  @Column({ type: DataType.INTEGER })
  numberLiving: number;

  @Column({ type: DataType.FLOAT })
  areaLiving: number;

  @Column({ type: DataType.FLOAT })
  priceLiving: number;

  @Column({ type: DataType.INTEGER })
  numberNonResidental: number;

  @Column({ type: DataType.FLOAT })
  areaNonResidental: number;

  @Column({ type: DataType.FLOAT })
  priceNonResidental: number;

  @Column({ type: DataType.INTEGER })
  numberParkingSpace: number;

  @Column({ type: DataType.FLOAT })
  areaParkingSpace: number;

  @Column({ type: DataType.FLOAT })
  priceParkingSpace: number;

  @ForeignKey(() => Building)
  @Column({ type: DataType.INTEGER })
  buildingId: number;

  @BelongsTo(() => Building)
  building: Building;
}
