import { ApiProperty } from '@nestjs/swagger';

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
  id: string;

  @ApiProperty({
    description: 'Payment amount in cents',
    example: 2000,
    type: 'number'
  })
  amount: number;

  @ApiProperty({
    description: 'Payment status',
    example: 'SUCCEEDED',
    enum: PaymentStatus,
    type: 'string'
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Payment creation timestamp',
    example: 1640995200,
    type: 'number'
  })
  created: number;

  @ApiProperty({
    description: 'Payment currency',
    example: 'usd',
    type: 'string'
  })
  currency: string;

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
