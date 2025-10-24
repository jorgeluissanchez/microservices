import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam,
  ApiQuery,
  ApiCookieAuth 
} from '@nestjs/swagger';
import { 
  CreatePaymentDto, 
  UpdatePaymentDto, 
  GetPaymentsDto, 
  PaymentResponseDto,
  PaginatedResponseDto 
} from '../dto/payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly httpService: HttpService) {}

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
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'POST',
        url,
        data: createPaymentDto,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Payment service error' });
    }
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
  async getPayments(@Query() query: GetPaymentsDto, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'GET',
        url,
        params: query,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Payment service error' });
    }
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
  async getPayment(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments/${id}`;
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
      res.status(status).json(axiosError.response?.data || { message: 'Payment service error' });
    }
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
  async updatePayment(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments/${id}`;
    try {
      const { data, status } = await this.httpService.axiosRef({
        method: 'PUT',
        url,
        data: updatePaymentDto,
        headers: req.headers,
      });
      res.status(status).json(data);
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status || 500;
      res.status(status).json(axiosError.response?.data || { message: 'Payment service error' });
    }
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
  async cancelPayment(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments/${id}`;
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
      res.status(status).json(axiosError.response?.data || { message: 'Payment service error' });
    }
  }
}
