import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegistrationDto } from './dto/registration.dto';

const secure = true;
const maxAge = 30 * 24 * 60 * 60 * 1000;
const sameSite = 'none';
const path = '/';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(
    @Body() dto: RegistrationDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registration(dto).then((res) => {
      response.cookie('refreshToken', res.refreshToken, {
        sameSite,
        httpOnly: true,
        maxAge,
        secure,
        path,
      });
      return { user: res.user, token: res.accessToken };
    });
  }

  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.authService.activate(link);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;
    return this.authService.login(email, password).then((res) => {
      response.cookie('refreshToken', res.refreshToken, {
        sameSite,
        httpOnly: true,
        maxAge,
        secure,
        path,
      });
      return { user: res.user, token: res.accessToken };
    });
  }

  @Get('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refreshToken'];
    return this.authService.refresh(refreshToken).then((res) => {
      response.cookie('refreshToken', res.refreshToken, {
        sameSite,
        httpOnly: true,
        maxAge,
        secure,
        path,
      });
      return { user: res.user, token: res.accessToken };
    });
  }

  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refreshToken'];
    return this.authService.logout(refreshToken).then(() => {
      response.clearCookie('refreshToken');
    });
  }
}
