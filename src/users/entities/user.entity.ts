import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Token } from 'src/tokens/entities/token.entity';
import { Role } from '../../roles/entities/roles.entity';
import { CreateUserDto } from '../dto/create-user-dto';

@Table({ tableName: 'users' })
export class User extends Model<User, CreateUserDto> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isActivated: boolean;

  @Column({ type: DataType.STRING })
  activationLink: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, defaultValue: 4 })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @HasMany(() => Token)
  tokens: Token[];
}
