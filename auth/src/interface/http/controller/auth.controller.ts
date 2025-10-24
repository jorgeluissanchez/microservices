import { type Response } from 'express';

import { Controller, Post, Res, UseGuards, Body, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBody } from '@nestjs/swagger';

import { LocalAuthGuard } from '@/interface/http/guards/local.auth-guard';
import { CurrentUser } from '@/interface/http/decorator/current-user.decorator';
import { JwtAuthGuard } from '@/interface/http/guards/jwt-auth.guard';
import { UserDocument } from '@/domain/entity/user.schema';
import { LoginDto } from '@/application/dto/login.dto';
import { AuthService } from '@/application/service/auth.service';

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
    },
    headers: {
      'Set-Cookie': {
        description: 'Cookie de autenticación establecida automáticamente',
        schema: { type: 'string' }
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

  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario obtenido usando la cookie de autenticación',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        name: { type: 'string', example: 'Juan Pérez' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
