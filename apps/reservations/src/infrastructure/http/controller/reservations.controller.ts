import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from '../../../application/service/reservations.service';
import { CreateReservationDto } from '../../../application/dto/create-reservation.dto';
import { UpdateReservationDto } from '../../../application/dto/update-reservation.dto';   
import { CurrentUser, JwtAuthGuard, type UserDTO } from '../../../../../../libs/common/src/index';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiOperation({ summary: 'Crear una nueva reservación' })
  @ApiBody({ type: CreateReservationDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Reservación creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
        startDate: { type: 'string', format: 'date-time', example: '2024-01-15T10:00:00Z' },
        endDate: { type: 'string', format: 'date-time', example: '2024-01-20T12:00:00Z' },
        placeId: { type: 'string', example: 'place_12345' },
        invoiceId: { type: 'string', example: 'inv_67890' },
        userId: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDTO,
  ) {
    return await this.reservationsService.create(
      createReservationDto,
      user._id,
    );
  }

  @ApiOperation({ summary: 'Obtener todas las reservaciones' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de reservaciones',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          placeId: { type: 'string' },
          invoiceId: { type: 'string' },
          userId: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.reservationsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una reservación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la reservación', example: '60d5f484f8d2e7001f5e7b3a' })
  @ApiResponse({ 
    status: 200, 
    description: 'Reservación encontrada',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        placeId: { type: 'string' },
        invoiceId: { type: 'string' },
        userId: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una reservación' })
  @ApiParam({ name: 'id', description: 'ID de la reservación', example: '60d5f484f8d2e7001f5e7b3a' })
  @ApiBody({ type: UpdateReservationDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Reservación actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f8d2e7001f5e7b3a' },
        startDate: { type: 'string', format: 'date-time' },
        endDate: { type: 'string', format: 'date-time' },
        placeId: { type: 'string' },
        invoiceId: { type: 'string' },
        userId: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @ApiOperation({ summary: 'Eliminar una reservación' })
  @ApiParam({ name: 'id', description: 'ID de la reservación', example: '60d5f484f8d2e7001f5e7b3a' })
  @ApiResponse({ status: 200, description: 'Reservación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}