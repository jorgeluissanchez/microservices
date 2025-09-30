import { Type } from 'class-transformer';
import { IsDate, IsDefined, IsNotEmpty, ValidateNested } from 'class-validator';

import { CreateChargeDto } from '@/libs/common/src/dto/create-charge.dto';

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @Type(() => CreateChargeDto)
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  charge: CreateChargeDto;
}