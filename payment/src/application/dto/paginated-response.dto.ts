import { ApiProperty } from '@nestjs/swagger';
import { PaymentResponseDto } from './payment-response.dto';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    type: [PaymentResponseDto],
    isArray: true
  })
  data: T[];

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: 'number'
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: 'number'
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
    type: 'number'
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
    type: 'number'
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
    type: 'boolean'
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
    type: 'boolean'
  })
  hasPrev: boolean;
}
