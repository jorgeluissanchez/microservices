import { Controller, Post, Get, Body, Req, Res, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiCookieAuth,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { LoginDto, CreateUserDto, LoginResponseDto, UserResponseDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y establece una cookie de autenticación'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    type: LoginResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'Cookie de autenticación establecida automáticamente',
        schema: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async login(@Body() loginDto: LoginDto, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.AUTH_SERVICE_URL}/auth/login`;
    try {
      const { data, status, headers } = await this.httpService.axiosRef({
        method: 'POST',
        url,
        data: loginDto,
        headers: req.headers,
      });
      
      // Forward the Set-Cookie header if present
      if (headers['set-cookie']) {
        res.setHeader('Set-Cookie', headers['set-cookie']);
      }
      
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Auth service error' });
    }
  }

  @Get('profile')
  @ApiOperation({ 
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Obtiene el perfil del usuario usando la cookie de autenticación'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil del usuario obtenido exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    const url = `${process.env.AUTH_SERVICE_URL}/auth/profile`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'GET',
        url,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Auth service error' });
    }
  }
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo usuario',
    description: 'Registra un nuevo usuario en el sistema'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  async createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.AUTH_SERVICE_URL}/users`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'POST',
        url,
        data: createUserDto,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Auth service error' });
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener información del usuario actual',
    description: 'Obtiene la información del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del usuario',
    type: UserResponseDto
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  async getCurrentUser(@Req() req: Request, @Res() res: Response) {
    const url = `${process.env.AUTH_SERVICE_URL}/users`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'GET',
        url,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Auth service error' });
    }
  }
}
