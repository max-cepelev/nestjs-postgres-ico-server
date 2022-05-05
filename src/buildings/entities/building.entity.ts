import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Complex } from 'src/complexes/entities/complex.entity';
import { Developer } from 'src/developers/entities/developer.entity';
import { Sale } from '../../sales/entities/sale.entity';

interface BuildingCreationAttrs {
  name: string;
  address: string;
  commissioningDate: Date | null;
  commissioned: boolean;
  propertyClass: string | null;
  wallMaterial: string | null;
  decorType: string | null;
  floorsAmount: number | null;
  apartmentsAmount: number | null;
  livingSpace: number | null;
  wallHeight: string | null;
  entrancesAmount: number | null;
  passengerElevatorsAmount: number | null;
  freightElevatorsAmount: number | null;
  nonLivingRoomsAmount: number | null;
  parkingLotsAmount: number | null;
  latitude: number | null;
  longitude: number | null;
  img: string | null;
  domRfId: number | null;
  domClickId: number | null;
  complexId: number;
  developerId: number;
}

@Table({ tableName: 'buildings' })
export class Building extends Model<Building, BuildingCreationAttrs> {
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
  floorsAmount: number;

  @Column({ type: DataType.INTEGER })
  apartmentsAmount: number;

  @Column({ type: DataType.FLOAT })
  livingSpace: number;

  @Column({ type: DataType.STRING })
  wallHeight: string;

  @Column({ type: DataType.INTEGER })
  entrancesAmount: number;

  @Column({ type: DataType.INTEGER })
  passengerElevatorsAmount: number;

  @Column({ type: DataType.INTEGER })
  freightElevatorsAmount: number;

  @Column({ type: DataType.INTEGER })
  nonLivingRoomsAmount: number;

  @Column({ type: DataType.INTEGER })
  parkingLotsAmount: number;

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

  @ForeignKey(() => Complex)
  @Column({ type: DataType.INTEGER })
  complexId: number;

  @BelongsTo(() => Complex)
  complex: Complex;

  @ForeignKey(() => Developer)
  @Column({ type: DataType.INTEGER })
  developerId: number;

  @BelongsTo(() => Developer)
  developer: Developer;

  @HasMany(() => Sale)
  sales: Sale[];
}
