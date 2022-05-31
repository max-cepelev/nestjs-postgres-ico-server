import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { Token } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token) private tokensRepository: typeof Token,
    private jwtService: JwtService,
  ) {}

  generateTokens(user: User) {
    const payload = {
      userId: user.id,
      email: user.email,
      isActivated: user.isActivated,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: '30m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.tokensRepository.findOne({
      where: { userId },
    });
    if (tokenData) {
      await this.tokensRepository.update(
        { refreshToken },
        { where: { userId } },
      );
    } else {
      await this.tokensRepository.create({ userId, refreshToken });
    }
  }

  async removeToken(refreshToken: string) {
    if (refreshToken) {
      await this.tokensRepository.destroy({
        where: { refreshToken },
      });
    }
  }

  async findToken(refreshToken: string) {
    if (refreshToken) {
      const tokenData = await this.tokensRepository.findOne({
        where: { refreshToken },
      });
      return tokenData;
    }
  }

  validateAccessToken(accessToken: string) {
    try {
      const userData = this.jwtService.verify(accessToken, {
        secret: process.env.ACCESS_SECRET,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const userData = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
      return userData;
    } catch (e) {
      return null;
    }
  }
}
