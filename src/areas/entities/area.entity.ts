import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Building } from 'src/buildings/entities/building.entity';
import { City } from 'src/cities/entities/city.entity';
import { Complex } from 'src/complexes/entities/complex.entity';
import { CreateAreaDto } from '../dto/create-area.dto';

@Table({ tableName: 'areas' })
export class Area extends Model<Area, CreateAreaDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER, allowNull: false })
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @HasMany(() => Building)
  buildings: Building[];

  @HasMany(() => Complex)
  complexes: Complex[];
}
