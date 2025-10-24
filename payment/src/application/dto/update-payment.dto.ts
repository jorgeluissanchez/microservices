import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty({
    description: 'New payment status',
    example: 'succeeded',
    enum: ['succeeded', 'pending', 'failed', 'canceled', 'refunded'],
    required: false
  })
  @IsString()
  @IsOptional()
  @IsIn(['succeeded', 'pending', 'failed', 'canceled', 'refunded'])
  status?: string;

  @ApiProperty({
    description: 'Payment description',
    example: 'Payment for reservation #12345',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}
