import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEmail, Min, Max, IsCreditCard, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CardDto {
  @ApiProperty({
    description: 'Card security code (CVC)',
    example: '123',
    minLength: 3,
    maxLength: 4
  })
  @IsString()
  @IsNotEmpty()
  cvc!: string;

  @ApiProperty({
    description: 'Card expiration month',
    example: 12,
    minimum: 1,
    maximum: 12
  })
  @IsNumber()
  exp_month!: number;

  @ApiProperty({
    description: 'Card expiration year',
    example: 2025,
    minimum: 2024
  })
  @IsNumber()
  exp_year!: number;

  @ApiProperty({
    description: 'Card number',
    example: '4242424242424242',
    pattern: '^[0-9]{13,19}$'
  })
  @IsCreditCard()
  number!: string;
}

export class CreateChargeDto {
  @ApiProperty({
    description: 'Card information for the payment',
    type: CardDto,
    example: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    }
  })
  @Type(() => CardDto)
  card!: CardDto;

  @ApiProperty({
    description: 'Amount to charge in cents',
    example: 2000,
    minimum: 1
  })
  @IsNumber()
  amount!: number;
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Card information for the payment',
    type: CardDto,
    example: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    }
  })
  @Type(() => CardDto)
  card!: CardDto;

  @ApiProperty({
    description: 'Amount to charge in cents',
    example: 2000,
    minimum: 50,
    maximum: 99999999
  })
  @IsNumber()
  @Min(50)
  @Max(99999999)
  amount!: number;

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

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'Payment description',
    example: 'Updated payment description',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'succeeded',
    enum: ['pending', 'succeeded', 'failed', 'canceled'],
    required: false
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export class GetPaymentsDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by payment status',
    example: 'succeeded',
    enum: ['pending', 'succeeded', 'failed', 'canceled'],
    required: false
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Filter by customer email',
    example: 'customer@example.com',
    required: false
  })
  @IsEmail()
  @IsOptional()
  customer_email?: string;

  @ApiProperty({
    description: 'Filter by reservation ID',
    example: 'res_1234567890',
    required: false
  })
  @IsString()
  @IsOptional()
  reservation_id?: string;

  @ApiProperty({
    description: 'Sort by field',
    example: 'created_at',
    enum: ['created_at', 'amount', 'status'],
    required: false
  })
  @IsString()
  @IsOptional()
  sort_by?: string = 'created_at';

  @ApiProperty({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false
  })
  @IsString()
  @IsOptional()
  sort_order?: string = 'desc';
}

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Payment ID',
    example: 'pi_1234567890abcdef'
  })
  id!: string;

  @ApiProperty({
    description: 'Payment amount in cents',
    example: 2000
  })
  amount!: number;

  @ApiProperty({
    description: 'Payment currency',
    example: 'usd'
  })
  currency!: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'succeeded',
    enum: ['pending', 'succeeded', 'failed', 'canceled']
  })
  status!: string;

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for reservation #12345'
  })
  description?: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com'
  })
  customer_email?: string;

  @ApiProperty({
    description: 'Reservation ID',
    example: 'res_1234567890'
  })
  reservation_id?: string;

  @ApiProperty({
    description: 'Payment creation date',
    example: '2024-01-15T10:00:00Z'
  })
  created_at!: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    type: 'array',
    items: { type: 'object' }
  })
  data!: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10
  })
  total_pages!: number;
}
