import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario para iniciar sesión',
    example: 'usuario@ejemplo.com',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseña123!',
    type: String,
  })
  @IsString()
  password: string;
}
