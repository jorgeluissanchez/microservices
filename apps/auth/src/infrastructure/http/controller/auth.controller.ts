import { Controller, Post, Res, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../../../application/service/auth.service';
import { LocalAuthGuard } from '../../../infrastructure/http/guards/local.auth-guard';
import { CurrentUser } from '../../../infrastructure/http/decorator/current-user.decorator';
import { UserDocument } from '../../../domain/entity/user.schema';
import { type Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../../infrastructure/http/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBody } from '@nestjs/swagger';
import { LoginDto } from '../../../application/dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
        email: { type: 'string', example: 'usuario@ejemplo.com' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiCookieAuth('Authentication')
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
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
