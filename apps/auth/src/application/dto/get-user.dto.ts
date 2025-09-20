import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '60d5f484f8d2e7001f5e7b3a',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  _id: string;
}
