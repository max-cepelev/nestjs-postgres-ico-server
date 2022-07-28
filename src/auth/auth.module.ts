import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [UsersModule, TokensModule, MailerModule, LogsModule],
})
export class AuthModule {}
