import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { CreateLeadDto } from '../dto/create-lead-dto';

@Table({ tableName: 'leads' })
export class Lead extends Model<Lead, CreateLeadDto> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true })
  uniq_id: string;

  @Column({ type: DataType.STRING })
  host: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  form_name: string;

  @Column({ type: DataType.STRING })
  form_id: string;

  @Column({ type: DataType.STRING })
  tran_id: string;

  @Column({ type: DataType.STRING })
  utm_source: string;

  @Column({ type: DataType.STRING })
  utm_medium: string;

  @Column({ type: DataType.STRING })
  utm_campaign: string;

  @Column({ type: DataType.STRING })
  utm_term: string;
}
