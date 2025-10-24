import { CardDTO } from '@/libs/common/src/dto/card.dto';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
} from 'class-validator';

export class CreateChargeDto {
  @Type(() => CardDTO)
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  card: CardDTO;

  @IsNumber()
  amount: number;
}
