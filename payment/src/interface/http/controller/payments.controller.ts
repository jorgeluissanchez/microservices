import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PaymentsService } from '../../../application/service/payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateChargeDto } from '@/libs/common/src/dto/create-charge.dto';
import { 
  CreatePaymentDto, 
  UpdatePaymentDto, 
  GetPaymentsDto, 
  PaymentResponseDto,
  PaginatedResponseDto 
} from '../../../application/dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Microservice endpoint (for internal communication)
  @MessagePattern('create_charge')
  @ApiOperation({ summary: 'Create a payment charge (Microservice)' })
  @ApiBody({ type: CreateChargeDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Charge created successfully',
    type: PaymentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid payment data' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async createcharge(@Payload() data: CreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }

  // HTTP endpoints
  @Post()
  @ApiOperation({ 
    summary: 'Create a new payment',
    description: 'Process a new payment with card information'
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Payment created successfully',
    type: PaymentResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid payment data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  @ApiCookieAuth('Authentication')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.createPayment(createPaymentDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all payments',
    description: 'Retrieve a paginated list of payments with optional filters'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiQuery({ name: 'customer_email', required: false, type: String, description: 'Filter by customer email' })
  @ApiQuery({ name: 'reservation_id', required: false, type: String, description: 'Filter by reservation ID' })
  @ApiQuery({ name: 'sort_by', required: false, type: String, description: 'Sort field' })
  @ApiQuery({ name: 'sort_order', required: false, type: String, description: 'Sort order' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payments retrieved successfully',
    type: PaginatedResponseDto<PaymentResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid query parameters' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required' 
  })
  @ApiCookieAuth('Authentication')
  async getPayments(@Query() query: GetPaymentsDto) {
    return this.paymentsService.getPayments(query);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get payment by ID',
    description: 'Retrieve a specific payment by its ID'
  })
  @ApiParam({ name: 'id', description: 'Payment ID', example: 'pi_1234567890abcdef' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment retrieved successfully',
    type: PaymentResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required' 
  })
  @ApiCookieAuth('Authentication')
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.getPayment(id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update payment',
    description: 'Update payment status or description'
  })
  @ApiParam({ name: 'id', description: 'Payment ID', example: 'pi_1234567890abcdef' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment updated successfully',
    type: PaymentResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid update data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required' 
  })
  @ApiCookieAuth('Authentication')
  async updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Cancel payment',
    description: 'Cancel a pending payment'
  })
  @ApiParam({ name: 'id', description: 'Payment ID', example: 'pi_1234567890abcdef' })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment canceled successfully',
    type: PaymentResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Payment not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Payment cannot be canceled' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - Authentication required' 
  })
  @ApiCookieAuth('Authentication')
  async cancelPayment(@Param('id') id: string) {
    return this.paymentsService.cancelPayment(id);
  }
}
