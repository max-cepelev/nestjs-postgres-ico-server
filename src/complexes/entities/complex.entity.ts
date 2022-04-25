import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Building } from '../../buildings/entities/building.entity';
import { CreateComplexDto } from '../dto/create-complex-dto';

@Table({ tableName: 'complexes' })
export class Complex extends Model<Complex, CreateComplexDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING })
  website: string;

  @Column({ type: DataType.STRING })
  info: string;

  @HasMany(() => Building)
  buildings: Building[];
}
