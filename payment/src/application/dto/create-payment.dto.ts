import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEmail, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CardDTO } from '@/libs/common/src/dto/card.dto';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Card information for the payment',
    type: CardDTO,
    example: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    }
  })
  @Type(() => CardDTO)
  card: CardDTO;

  @ApiProperty({
    description: 'Amount to charge in cents',
    example: 2000,
    minimum: 50,
    maximum: 99999999
  })
  @IsNumber()
  @Min(50)
  @Max(99999999)
  amount: number;

  @ApiProperty({
    description: 'Payment currency',
    example: 'usd',
    default: 'usd',
    enum: ['usd', 'eur', 'gbp']
  })
  @IsString()
  @IsOptional()
  currency?: string = 'usd';

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for reservation #12345',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  customer_email?: string;

  @ApiProperty({
    description: 'Reservation ID associated with this payment',
    example: 'res_1234567890',
    required: false
  })
  @IsString()
  @IsOptional()
  reservation_id?: string;
}
