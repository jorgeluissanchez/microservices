import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../../../application/service/users.service';
import { CreateUserDTO } from '../../../application/dto/create-user.dto';
import { JwtAuthGuard } from '../../../infrastructure/http/guards/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/http/decorator/current-user.decorator';
import { UserDocument } from '../../../domain/entity/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
        email: { type: 'string', example: 'usuario@ejemplo.com' }
      }
    }
  })
  
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del usuario',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
        email: { type: 'string', example: 'usuario@ejemplo.com' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
