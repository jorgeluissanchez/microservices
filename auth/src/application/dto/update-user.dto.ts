import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'New email address', required: false })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ example: 'NewPassword123!', description: 'New password', required: false })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
}
