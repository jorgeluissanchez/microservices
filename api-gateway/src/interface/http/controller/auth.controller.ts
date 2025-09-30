import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AuthService } from '@/application/service/auth.service';
import { CreateUserDto } from '@/application/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
}
