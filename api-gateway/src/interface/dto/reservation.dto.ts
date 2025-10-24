import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEmail, IsDateString, IsOptional, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'ID del lugar a reservar',
    example: '60d5f484f8d2e7001f5e7b3a',
  })
  @IsString()
  placeId!: string;

  @ApiProperty({
    description: 'Fecha de inicio de la reservación',
    example: '2024-02-15T10:00:00Z',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    description: 'Fecha de fin de la reservación',
    example: '2024-02-17T12:00:00Z',
  })
  @IsDateString()
  endDate!: string;

  @ApiProperty({
    description: 'Monto total de la reservación en centavos',
    example: 15000,
  })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({
    description: 'Moneda del pago',
    example: 'usd',
    default: 'usd',
  })
  @IsString()
  @IsOptional()
  currency?: string = 'usd';

  @ApiProperty({
    description: 'ID del usuario (se extrae automáticamente de la cookie de autenticación)',
    example: '60d5f484f8d2e7001f5e7b3a',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Email del cliente (se extrae automáticamente de la cookie de autenticación)',
    example: 'cliente@ejemplo.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;
}

export class ChangeReservationStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la reservación',
    example: 'CONFIRMED',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED'],
  })
  @IsString()
  status!: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED';

  @ApiProperty({
    description: 'Razón del cambio de estado (opcional)',
    example: 'Pago procesado exitosamente',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class ReservationResponseDto {
  @ApiProperty({
    description: 'ID único de la reservación',
    example: '60d5f484f8d2e7001f5e7b3a',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del lugar reservado',
    example: '60d5f484f8d2e7001f5e7b3a',
  })
  placeId!: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '60d5f484f8d2e7001f5e7b3a',
  })
  userId!: string;

  @ApiProperty({
    description: 'Fecha de inicio',
    example: '2024-02-15T10:00:00Z',
  })
  startDate!: Date;

  @ApiProperty({
    description: 'Fecha de fin',
    example: '2024-02-17T12:00:00Z',
  })
  endDate!: Date;

  @ApiProperty({
    description: 'Monto total en centavos',
    example: 15000,
  })
  amount!: number;

  @ApiProperty({
    description: 'Moneda',
    example: 'usd',
  })
  currency!: string;

  @ApiProperty({
    description: 'Email del cliente',
    example: 'cliente@ejemplo.com',
  })
  customerEmail!: string;

  @ApiProperty({
    description: 'Estado de la reservación',
    example: 'PENDING',
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED'],
  })
  status!: string;

  @ApiProperty({
    description: 'ID del pago asociado',
    example: 'pi_1234567890abcdef',
    required: false,
  })
  paymentId?: string;

  @ApiProperty({
    description: 'URL de pago de Stripe',
    example: 'https://checkout.stripe.com/pay/cs_test_1234567890',
    required: false,
  })
  paymentUrl?: string;

  @ApiProperty({
    description: 'Fecha de confirmación',
    example: '2024-02-15T10:30:00Z',
    required: false,
  })
  confirmedAt?: Date;

  @ApiProperty({
    description: 'Fecha de cancelación',
    example: '2024-02-15T10:30:00Z',
    required: false,
  })
  cancelledAt?: Date;

  @ApiProperty({
    description: 'Fecha de rechazo',
    example: '2024-02-15T10:30:00Z',
    required: false,
  })
  rejectedAt?: Date;

  @ApiProperty({
    description: 'Razón del rechazo',
    example: 'Lugar no disponible',
    required: false,
  })
  rejectionReason?: string;

  @ApiProperty({
    description: 'Timestamp de creación',
    example: '2024-02-15T10:00:00Z',
  })
  timestamp!: Date;
}
