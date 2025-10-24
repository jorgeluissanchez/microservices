import { Controller, Get, Post, Patch, Delete, Body, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam,
  ApiCookieAuth 
} from '@nestjs/swagger';
import { 
  CreateReservationDto, 
  UpdateReservationDto, 
  ReservationResponseDto 
} from '../dto/reservation.dto';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear una nueva reservación',
    description: 'Crea una nueva reservación con información de pago'
  })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Reservación creada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  async create(@Body() createReservationDto: CreateReservationDto, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.RESERVATION_SERVICE_URL}/reservations`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'POST',
        url,
        data: createReservationDto,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Reservation service error' });
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las reservaciones',
    description: 'Obtiene una lista de todas las reservaciones del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de reservaciones',
    type: [ReservationResponseDto]
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  async findAll(@Req() req: Request, @Res() res: Response) {
    const url = `${process.env.RESERVATION_SERVICE_URL}/reservations`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'GET',
        url,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Reservation service error' });
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener una reservación por ID',
    description: 'Obtiene una reservación específica por su ID'
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', example: '60d5f484f8d2e7001f5e7b3a' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reservación encontrada',
    type: ReservationResponseDto
  })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  async findOne(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.RESERVATION_SERVICE_URL}/reservations/${id}`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'GET',
        url,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Reservation service error' });
    }
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar una reservación',
    description: 'Actualiza una reservación existente'
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', example: '60d5f484f8d2e7001f5e7b3a' })
  @ApiBody({ type: UpdateReservationDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Reservación actualizada exitosamente',
    type: ReservationResponseDto
  })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.RESERVATION_SERVICE_URL}/reservations/${id}`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'PATCH',
        url,
        data: updateReservationDto,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Reservation service error' });
    }
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar una reservación',
    description: 'Elimina una reservación existente'
  })
  @ApiParam({ name: 'id', description: 'ID de la reservación', example: '60d5f484f8d2e7001f5e7b3a' })
  @ApiResponse({ status: 200, description: 'Reservación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiCookieAuth('Authentication')
  async remove(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.RESERVATION_SERVICE_URL}/reservations/${id}`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'DELETE',
        url,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Reservation service error' });
    }
  }
}
