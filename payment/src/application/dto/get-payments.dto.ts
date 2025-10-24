import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsIn, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPaymentsDto {
  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    required: false,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filter by payment status',
    example: 'succeeded',
    enum: ['succeeded', 'pending', 'failed', 'canceled', 'refunded'],
    required: false
  })
  @IsOptional()
  @IsString()
  @IsIn(['succeeded', 'pending', 'failed', 'canceled', 'refunded'])
  status?: string;

  @ApiProperty({
    description: 'Filter by customer email',
    example: 'customer@example.com',
    required: false
  })
  @IsOptional()
  @IsString()
  customer_email?: string;

  @ApiProperty({
    description: 'Filter by reservation ID',
    example: 'res_1234567890',
    required: false
  })
  @IsOptional()
  @IsString()
  reservation_id?: string;

  @ApiProperty({
    description: 'Sort field',
    example: 'created',
    enum: ['created', 'amount', 'status'],
    required: false,
    default: 'created'
  })
  @IsOptional()
  @IsString()
  @IsIn(['created', 'amount', 'status'])
  sort_by?: string = 'created';

  @ApiProperty({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    required: false,
    default: 'desc'
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sort_order?: string = 'desc';
}
