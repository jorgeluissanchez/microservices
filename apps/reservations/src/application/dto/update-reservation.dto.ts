import { PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from '../../application/dto/create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}