import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario para iniciar sesión',
    example: 'usuario@ejemplo.com',
    type: String,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseña123!',
    type: String,
  })
  @IsString()
  password!: string;
}

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
    type: String,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario (debe ser fuerte)',
    example: 'MiContraseña123!',
    type: String,
    minLength: 8,
  })
  @IsString()
  @IsStrongPassword()
  password!: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '60d5f484f8d2e7001f5e7b3a',
  })
  _id!: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  email!: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '60d5f484f8d2e7001f5e7b3a',
  })
  _id!: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Cookie de autenticación establecida automáticamente',
    example: 'Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  cookie?: string;
}
