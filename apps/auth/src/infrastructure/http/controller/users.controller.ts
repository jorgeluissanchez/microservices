import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../../../application/service/users.service';
import { CreateUserDTO } from '../../../application/dto/create-user.dto';
import { JwtAuthGuard } from '../../../infrastructure/http/guards/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/http/decorator/current-user.decorator';
import { UserDocument } from '../../../domain/entity/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
