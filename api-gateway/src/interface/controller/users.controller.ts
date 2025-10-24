import { Controller, Post, Get, Body, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema'
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
          description: 'Contraseña del usuario (debe ser fuerte)',
          minLength: 8
        },
        role: {
          type: 'string',
          enum: ['user', 'admin'],
          example: 'user',
          description: 'Rol del usuario',
          default: 'user'
        }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68fbec845439576c02414c2d' },
        email: { type: 'string', example: 'user@example.com' },
        role: { type: 'string', example: 'user' }
      }
    }
  })
  @ApiResponse({ status: 422, description: 'Email ya existe' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async createUser(@Body() createUserDto: { email: string; password: string; role?: string }, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Creating user:', createUserDto);
    const url = `${process.env.AUTH_SERVICE_URL}/users`;
    console.log('API Gateway: Auth service URL:', url);
    
    try {
      console.log('API Gateway: Making request to auth service...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createUserDto),
      });
      
      console.log('API Gateway: Response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Response data:', data);
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error creating user:', error);
      res.status(500).json({ message: 'Auth service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Obtiene la lista de todos los usuarios registrados'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68fbec845439576c02414c2d' },
          email: { type: 'string', example: 'user@example.com' },
          role: { type: 'string', example: 'user' }
        }
      }
    }
  })
  async getUsers(@Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Getting users list');
    const url = `${process.env.AUTH_SERVICE_URL}/users`;
    console.log('API Gateway: Auth service URL:', url);
    
    try {
      console.log('API Gateway: Making get users request...');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Gateway: Get users response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Get users response data:', data);
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error getting users:', error);
      res.status(500).json({ message: 'Auth service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}
