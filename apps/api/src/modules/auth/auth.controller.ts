import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role?: 'ADMIN' | 'EDITOR' | 'VIEWER';
    }
  ) {
    return this.authService.register(body);
  }
}
