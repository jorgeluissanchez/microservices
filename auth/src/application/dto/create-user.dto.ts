import { IsEmail, IsString, IsStrongPassword, IsOptional, IsIn } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (debe ser fuerte)',
    example: 'MiContraseña123!',
    type: String,
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'user',
    enum: ['user', 'admin'],
    default: 'user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['user', 'admin'])
  role?: string;
}
