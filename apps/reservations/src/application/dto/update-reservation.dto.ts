import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}