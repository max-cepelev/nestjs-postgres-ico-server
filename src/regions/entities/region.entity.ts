import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { City } from 'src/cities/entities/city.entity';
import { CreateRegionDto } from '../dto/create-region.dto';

@Table({ tableName: 'regions' })
export class Region extends Model<Region, CreateRegionDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @HasMany(() => City)
  buildings: City[];
}
