import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './entities/token.entity';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  controllers: [],
  imports: [
    SequelizeModule.forFeature([Token]),
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  exports: [TokensService],
})
export class TokensModule {}
