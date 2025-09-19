import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../../../application/service/auth.service';
import { LocalAuthGuard } from '../../../infrastructure/http/guards/local.auth-guard';
import { CurrentUser } from '../../../infrastructure/http/decorator/current-user.decorator';
import { UserDocument } from '../../../domain/entity/user.schema';
import { type Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../../infrastructure/http/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
