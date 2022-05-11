import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { RegistrationDto } from './dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokensService: TokensService,
    private readonly mailerService: MailerService,
  ) {}

  // registration user
  async registration(dto: RegistrationDto) {
    const { name, email, password, phone } = dto;
    const candidate = await this.usersService.findByEmail(email);
    if (candidate) {
      throw new HttpException(
        `Пользователь с адресом ${email} уже существует`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    const activationLink = uuidv4();
    const user = await this.usersService.create({
      email,
      password: hash,
      name,
      phone,
      activationLink,
      roleId: 4,
      isActivated: false,
    });

    try {
      await this.mailerService.sendMail({
        to: 'dules@inbox.ru',
        subject: 'Зарегистрирован новый пользователь',
        text: '',
        html: `
                <div>
                  <h1>Зарегистрирован новый пользователь, отправьте ссылку для активации</h1>
                </div>
              `,
      });
    } catch (error) {
      console.log(error);
    }

    const tokens = this.tokensService.generateTokens(user);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        name: user.name,
        email: user.email,
        role: {
          id: 4,
          value: 'client',
          description: 'Клиент',
        },
        isActivated: user.isActivated,
      },
    };
  }

  // activate user
  async activate(activationLink: string) {
    const user = await this.usersService.findByActivationLink(activationLink);
    if (user) {
      const { id, isActivated } = user;
      if (isActivated) {
        throw new HttpException(
          'Пользователь уже активирован',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const user = await this.usersService.update(id, { isActivated: true });
        if (user) {
          return { message: 'Пользователь активирован' };
        } else {
          throw new HttpException(
            'Ошибка активации',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } else {
      throw new HttpException(
        'Некорректная ссылка активации',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // login user
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const userPassword = user.password;
      const isPassEquals = await bcrypt.compare(password, userPassword);
      if (!isPassEquals) {
        throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
      }
      const tokens = this.tokensService.generateTokens(user);
      await this.tokensService.saveToken(user.id, tokens.refreshToken);
      return {
        ...tokens,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          isActivated: user.isActivated,
        },
      };
    } else {
      throw new HttpException(
        `Пользователь с email ${email} не найден`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // delete refresh token
  async logout(refreshToken: string) {
    const response = await this.tokensService.removeToken(refreshToken);
    return response;
  }

  // refresh token
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(
        `Пользователь не авторизован`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userData = this.tokensService.validateRefreshTokenToken(refreshToken);
    const tokenFromDb = await this.tokensService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new HttpException(
        `Пользователь не авторизован`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.usersService.findOne(userData.userId);
    const tokens = this.tokensService.generateTokens(user);
    await this.tokensService.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isActivated: user.isActivated,
      },
    };
  }
}
