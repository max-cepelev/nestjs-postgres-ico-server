import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Property } from 'src/properties/entities/property.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { CreatePropertyTypeDto } from '../dto/create-property-type.dto';

@Table({ tableName: 'property-types' })
export class PropertyType extends Model<PropertyType, CreatePropertyTypeDto> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @HasMany(() => Sale)
  sales: Sale[];

  @HasMany(() => Property)
  properties: Property[];
}
