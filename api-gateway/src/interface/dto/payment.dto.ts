import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEmail, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Test token or existing payment method ID from Stripe (e.g., tok_visa)',
    example: 'tok_visa',
    required: false,
  })
  @IsString()
  @IsOptional()
  token?: string;

  @ApiProperty({
    description: 'Amount to charge in cents',
    example: 2000,
    minimum: 50,
    maximum: 99999999,
  })
  @IsNumber()
  @Min(50)
  @Max(99999999)
  amount!: number;

  @ApiProperty({
    description: 'Payment currency',
    example: 'usd',
    default: 'usd',
    enum: ['usd', 'eur', 'gbp'],
  })
  @IsString()
  @IsOptional()
  currency?: string = 'usd';

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for reservation #12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  customer_email?: string;

  @ApiProperty({
    description: 'Reservation ID associated with this payment',
    example: 'res_1234567890',
    required: false,
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

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export class PaymentResponseDto {
  @ApiProperty({
    description: 'Unique payment ID',
    example: 'pi_1234567890abcdef',
    type: 'string'
  })
  id!: string;

  @ApiProperty({
    description: 'Payment amount in cents',
    example: 2000,
    type: 'number'
  })
  amount!: number;

  @ApiProperty({
    description: 'Payment status',
    example: 'SUCCEEDED',
    enum: PaymentStatus,
    type: 'string'
  })
  status!: PaymentStatus;

  @ApiProperty({
    description: 'Payment creation timestamp',
    example: 1640995200,
    type: 'number'
  })
  created!: number;

  @ApiProperty({
    description: 'Payment currency',
    example: 'usd',
    type: 'string'
  })
  currency!: string;

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for reservation #12345',
    type: 'string',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'customer@example.com',
    type: 'string',
    required: false
  })
  customerEmail?: string;

  @ApiProperty({
    description: 'Reservation ID',
    example: 'res_12345',
    type: 'string',
    required: false
  })
  reservationId?: string;
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
