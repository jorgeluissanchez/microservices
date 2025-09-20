import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Fecha de inicio de la reservación',
    example: '2024-01-15T10:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de fin de la reservación',
    example: '2024-01-20T12:00:00Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    description: 'ID del lugar a reservar',
    example: 'place_12345',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  placeId: string;

  @ApiProperty({
    description: 'ID de la factura asociada',
    example: 'inv_67890',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}