import { Controller, Post, Patch, Body, Param, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { CreateReservationDto, ChangeReservationStatusDto, ReservationResponseDto } from '../dto/reservation.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear reservación pendiente desde un lugar',
    description: 'Crea una nueva reservación en estado PENDING a partir de un ID de lugar válido. El userId y customerEmail se extraen automáticamente de la cookie de autenticación (Available to all authenticated users)'
  })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Reservación creada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Lugar no encontrado' })
  @ApiSecurity('bearer')
  async createReservationFromPlace(@Body() createReservationDto: CreateReservationDto, @CurrentUser() user: any, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Received reservation request:', createReservationDto);
    console.log('API Gateway: User from cookie:', user);
    
    // Extraer información del usuario de la cookie de autenticación
    const userId = user?.userId || user?.id;
    const customerEmail = user?.email || createReservationDto.customerEmail;
    
    // Preparar datos para el servicio de reservaciones (sin userId en el body)
    const reservationData = {
      ...createReservationDto,
      customerEmail: customerEmail,
    };
    
    console.log('API Gateway: Reservation data for service:', reservationData);
    console.log('API Gateway: User ID (will be passed separately):', userId);
    
    const url = `${process.env.RESERVATION_SERVICE_URL}/reservations`;
    console.log('API Gateway: Creating reservation, URL:', url);
    
    try {
      console.log('API Gateway: Making request to reservation service...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId, // Pasar userId como header personalizado
        },
        body: JSON.stringify(reservationData),
      });
      
      console.log('API Gateway: Response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Response data:', data);
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error creating reservation:', error);
      res.status(500).json({ message: 'Reservation service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  @Patch(':id/status')
  @ApiOperation({ 
    summary: 'Cambiar estado de reservación',
    description: 'Cambia el estado de una reservación existente. Estados disponibles: PENDING, CONFIRMED, CANCELLED, REJECTED (Available to all authenticated users)'
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación' })
  @ApiBody({ type: ChangeReservationStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Estado de reservación actualizado exitosamente',
    type: ReservationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 400, description: 'Estado inválido o no se puede cambiar' })
  @ApiSecurity('bearer')
  async changeReservationStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeReservationStatusDto,
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const url = `${process.env.RESERVATION_SERVICE_URL}/reservations/${id}/status`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changeStatusDto),
      });
      
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error changing reservation status:', error);
      res.status(500).json({ message: 'Reservation service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

}