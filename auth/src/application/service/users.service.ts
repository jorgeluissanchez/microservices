import * as bcryptjs from 'bcryptjs';

import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { UserRepository } from '@/infrastructure/repository/user.repository';
import { CreateUserDTO } from '@/application/dto/create-user.dto';
import { UpdateUserDto } from '@/application/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) { }

  async create(createUserDto: CreateUserDTO) {
    await this.validateCreateUserDto(createUserDto);
    return this.userRepository.create({
      ...createUserDto,
      password: await bcryptjs.hash(createUserDto.password, 10),
      role: createUserDto.role || 'user', // Default to 'user' if not specified
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log('UsersService: Updating user', id, updateUserDto);
    const updates: any = { ...updateUserDto };
    if (updates.password) {
      updates.password = await bcryptjs.hash(updates.password, 10);
    }
    const result = await this.userRepository.findOneAndUpdate({ _id: id }, updates);
    console.log('UsersService: Update result', result);
    return result;
  }

  private async validateCreateUserDto(createUserDto: CreateUserDTO) {
    const existingUser = await this.userRepository.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new UnprocessableEntityException('Email already exists');
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordIsValid = await bcryptjs.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getUser(email: string) {
    return this.userRepository.findOne({ email });
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }
}
