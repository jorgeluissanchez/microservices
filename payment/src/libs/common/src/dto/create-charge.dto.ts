import { CardDTO } from '@/libs/common/src/dto/card.dto';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChargeDto {
  @ApiProperty({
    description: 'Card information for the payment',
    type: CardDTO,
    example: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    }
  })
  @Type(() => CardDTO)
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  card: CardDTO;

  @ApiProperty({
    description: 'Amount to charge in cents',
    example: 2000,
    minimum: 1
  })
  @IsNumber()
  amount: number;
}
