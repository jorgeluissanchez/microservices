import { Controller, Post, Get, Patch, Body, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) { }

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT en una cookie'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
          description: 'Email del usuario'
        },
        password: {
          type: 'string',
          example: 'User123!',
          description: 'Contraseña del usuario'
        }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68fbec845439576c02414c2d' },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'user' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async login(@Body() loginDto: { email: string; password: string }, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Login request:', loginDto);
    const url = `${process.env.AUTH_SERVICE_URL}/auth/login`;
    console.log('API Gateway: Auth service URL:', url);

    try {
      console.log('API Gateway: Making login request...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDto),
      });

      console.log('API Gateway: Login response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Login response data:', data);

      // Forward cookies from auth service to client
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        console.log('API Gateway: Setting cookie:', setCookieHeader);
        res.setHeader('Set-Cookie', setCookieHeader);
      } else {
        console.log('API Gateway: No Set-Cookie header received from auth service');
      }

      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error during login:', error);
      res.status(500).json({ message: 'Auth service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtener perfil del usuario',
    description: 'Obtiene la información del perfil del usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68fbec845439576c02414c2d' },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'user' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiSecurity('bearer')
  async getProfile(@CurrentUser() user: any, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Profile request for user:', user);
    console.log('API Gateway: Request cookies:', req.cookies);
    console.log('API Gateway: Request headers:', req.headers);
    const url = `${process.env.AUTH_SERVICE_URL}/auth/profile`;
    console.log('API Gateway: Auth service URL:', url);

    try {
      console.log('API Gateway: Making profile request...');
      const authToken = req.cookies?.Authentication || req.headers.authorization?.replace('Bearer ', '');
      console.log('API Gateway: Auth token for profile request:', authToken ? authToken.substring(0, 20) + '...' : 'None');

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `Authentication=${authToken}`
        },
      });

      console.log('API Gateway: Profile response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Profile response data:', data);

      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error getting profile:', error);
      res.status(500).json({ message: 'Auth service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  @Patch('profile')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Actualizar perfil del usuario',
    description: 'Actualiza la información del perfil del usuario autenticado'
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68fbec845439576c02414c2d' },
        email: { type: 'string', example: 'user@example.com' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiSecurity('bearer')
  async updateProfile(@Body() updateDto: UpdateUserDto, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Update profile request:', updateDto);
    const url = `${process.env.AUTH_SERVICE_URL}/auth/profile`;
    console.log('API Gateway: Auth service URL:', url);

    try {
      const authToken = req.cookies?.Authentication || req.headers.authorization?.replace('Bearer ', '');

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `Authentication=${authToken}`
        },
        body: JSON.stringify(updateDto),
      });

      console.log('API Gateway: Update profile response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Update profile response data:', data);

      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error updating profile:', error);
      res.status(500).json({ message: 'Auth service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
