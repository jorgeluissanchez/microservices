import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardDTO {
  @ApiProperty({
    description: 'Card security code (CVC)',
    example: '123',
    minLength: 3,
    maxLength: 4
  })
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @ApiProperty({
    description: 'Card expiration month',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @IsNumber()
  exp_month: number;

  @ApiProperty({
    description: 'Card expiration year',
    example: 2025,
    minimum: 2024
  })
  @IsNumber()
  exp_year: number;

  @ApiProperty({
    description: 'Card number',
    example: '4242424242424242',
    pattern: '^[0-9]{13,19}$'
  })
  @IsCreditCard()
  number: string;
}
