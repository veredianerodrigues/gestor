import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
    }
  ) {
    return this.usersService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      email?: string;
      role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
      avatar?: string;
    }
  ) {
    return this.usersService.update(id, body);
  }
}
