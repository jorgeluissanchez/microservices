import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDefined, IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateChargeDto } from './payment.dto';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Fecha de inicio de la reservación',
    example: '2024-01-15T10:00:00Z',
    type: String,
    format: 'date-time'
  })
  @IsDate()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty({
    description: 'Fecha de fin de la reservación',
    example: '2024-01-20T12:00:00Z',
    type: String,
    format: 'date-time'
  })
  @IsDate()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty({
    description: 'Información de pago para la reservación',
    type: CreateChargeDto
  })
  @Type(() => CreateChargeDto)
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  charge!: CreateChargeDto;
}

export class UpdateReservationDto {
  @ApiProperty({
    description: 'Fecha de inicio de la reservación',
    example: '2024-01-15T10:00:00Z',
    type: String,
    format: 'date-time',
    required: false
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'Fecha de fin de la reservación',
    example: '2024-01-20T12:00:00Z',
    type: String,
    format: 'date-time',
    required: false
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({
    description: 'Información de pago para la reservación',
    type: CreateChargeDto,
    required: false
  })
  @Type(() => CreateChargeDto)
  @IsOptional()
  @ValidateNested()
  charge?: CreateChargeDto;
}

export class ReservationResponseDto {
  @ApiProperty({
    description: 'ID único de la reservación',
    example: '60d5f484f8d2e7001f5e7b3a'
  })
  id!: string;

  @ApiProperty({
    description: 'Fecha de inicio de la reservación',
    example: '2024-01-15T10:00:00Z',
    type: String,
    format: 'date-time'
  })
  startDate!: Date;

  @ApiProperty({
    description: 'Fecha de fin de la reservación',
    example: '2024-01-20T12:00:00Z',
    type: String,
    format: 'date-time'
  })
  endDate!: Date;

  @ApiProperty({
    description: 'ID del lugar reservado',
    example: 'place_12345'
  })
  placeId!: string;

  @ApiProperty({
    description: 'ID de la factura asociada',
    example: 'inv_67890'
  })
  invoiceId!: string;

  @ApiProperty({
    description: 'ID del usuario que hizo la reservación',
    example: '60d5f484f8d2e7001f5e7b3a'
  })
  userId!: string;

  @ApiProperty({
    description: 'Timestamp de creación',
    example: '2024-01-15T10:00:00Z',
    type: String,
    format: 'date-time'
  })
  timestamp!: Date;
}
