import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreatePlaceDto {
  @ApiProperty({
    description: 'Nombre del lugar',
    example: 'Hotel Marriott',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción del lugar',
    example: 'Hotel de lujo en el centro de la ciudad',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Dirección del lugar',
    example: 'Av. Principal 123',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Madrid',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'País',
    example: 'España',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Capacidad máxima de personas',
    example: 100,
  })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Precio por día en centavos',
    example: 15000,
  })
  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @ApiProperty({
    description: 'Amenidades disponibles',
    example: ['WiFi', 'Parking', 'Piscina'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({
    description: 'URLs de imágenes',
    example: ['https://example.com/image1.jpg'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}

export class UpdatePlaceDto {
  @ApiProperty({
    description: 'Nombre del lugar',
    example: 'Hotel Marriott',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Descripción del lugar',
    example: 'Hotel de lujo en el centro de la ciudad',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Dirección del lugar',
    example: 'Av. Principal 123',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Madrid',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'País',
    example: 'España',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'Capacidad máxima de personas',
    example: 100,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    description: 'Precio por día en centavos',
    example: 15000,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerDay?: number;

  @ApiProperty({
    description: 'Amenidades disponibles',
    example: ['WiFi', 'Parking', 'Piscina'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({
    description: 'URLs de imágenes',
    example: ['https://example.com/image1.jpg'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Si el lugar está activo',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class PlaceResponseDto {
  @ApiProperty({
    description: 'ID único del lugar',
    example: '60d5f484f8d2e7001f5e7b3a',
  })
  _id: string;

  @ApiProperty({
    description: 'Nombre del lugar',
    example: 'Hotel Marriott',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del lugar',
    example: 'Hotel de lujo en el centro de la ciudad',
  })
  description: string;

  @ApiProperty({
    description: 'Dirección del lugar',
    example: 'Av. Principal 123',
  })
  address: string;

  @ApiProperty({
    description: 'Ciudad',
    example: 'Madrid',
  })
  city: string;

  @ApiProperty({
    description: 'País',
    example: 'España',
  })
  country: string;

  @ApiProperty({
    description: 'Capacidad máxima de personas',
    example: 100,
  })
  capacity: number;

  @ApiProperty({
    description: 'Precio por día en centavos',
    example: 15000,
  })
  pricePerDay: number;

  @ApiProperty({
    description: 'Amenidades disponibles',
    example: ['WiFi', 'Parking', 'Piscina'],
  })
  amenities: string[];

  @ApiProperty({
    description: 'URLs de imágenes',
    example: ['https://example.com/image1.jpg'],
  })
  images: string[];

  @ApiProperty({
    description: 'Si el lugar está activo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Calificación promedio',
    example: 4.5,
  })
  rating: number;

  @ApiProperty({
    description: 'Número de reseñas',
    example: 25,
  })
  reviewCount: number;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
