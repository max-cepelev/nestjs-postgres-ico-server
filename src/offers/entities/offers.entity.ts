import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreateOfferDto } from '../dto/create-offer-dto';

@Table({ tableName: 'offers' })
export class Offer extends Model<Offer, CreateOfferDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    unique: true,
  })
  id: number;

  @Column({ type: DataType.STRING })
  image: string;

  @Column({ type: DataType.STRING })
  developer: string;

  @Column({ type: DataType.STRING })
  complex: string;

  @Column({ type: DataType.INTEGER })
  complexId: number;

  @Column({ type: DataType.STRING })
  address: string;

  @Column({ type: DataType.STRING })
  commissioningDate: string;

  @Column({ type: DataType.FLOAT })
  price: number;

  @Column({ type: DataType.FLOAT })
  totalArea: number;

  @Column({ type: DataType.INTEGER })
  floor: number;

  @Column({ type: DataType.INTEGER })
  floorsAmount: number;

  @Column({ type: DataType.INTEGER })
  roomsAmount: number;

  @Column({ type: DataType.STRING })
  complexUrl: string;
}
