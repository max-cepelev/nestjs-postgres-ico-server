import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin-activate/:id')
  administratorActivation(@Param('id') id: number) {
    return this.usersService.administratorActivation(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin-deactivate/:id')
  administratorDeactivation(@Param('id') id: number) {
    return this.usersService.administratorDeactivation(id);
  }
}
