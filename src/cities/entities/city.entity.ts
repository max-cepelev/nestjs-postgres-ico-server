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
import { Region } from 'src/regions/entities/region.entity';
import { CreateCityDto } from '../dto/create-city.dto';

@Table({ tableName: 'cities' })
export class City extends Model<City, CreateCityDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @ForeignKey(() => Region)
  @Column({ type: DataType.INTEGER, allowNull: false })
  regionId: number;

  @BelongsTo(() => Region)
  region: Region;

  @HasMany(() => Building)
  buildings: Building[];
}
