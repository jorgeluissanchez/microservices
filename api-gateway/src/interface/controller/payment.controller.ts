import { Controller, Post, Body, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam,
  ApiSecurity,
  ApiExcludeEndpoint
} from '@nestjs/swagger';
import { 
  CreatePaymentDto, 
  PaymentResponseDto
} from '../dto/payment.dto';
import { CurrentUser } from '../../decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor() {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear pago y obtener link de Stripe',
    description: 'Crea un nuevo pago y devuelve el link de Stripe para procesar el pago (Available to all authenticated users)'
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Pago creado exitosamente con link de Stripe',
    schema: {
      type: 'object',
      properties: {
        paymentUrl: {
          type: 'string',
          description: 'URL de Stripe para procesar el pago',
          example: 'https://checkout.stripe.com/pay/cs_test_1234567890'
        },
        paymentId: {
          type: 'string',
          description: 'ID del pago creado',
          example: 'pi_1234567890abcdef'
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de pago inválidos' })
  @ApiResponse({ status: 500, description: 'Error al crear el pago' })
  @ApiSecurity('bearer')
  async createPayment(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() user: any, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Creating payment request:', createPaymentDto);
    console.log('API Gateway: User from cookie:', user);
    
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments`;
    console.log('API Gateway: Payment service URL:', url);
    
    try {
      console.log('API Gateway: Making request to payment service...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPaymentDto),
      });
      
      console.log('API Gateway: Payment service response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Payment service response data:', data);
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error creating payment:', error);
      res.status(500).json({ message: 'Payment service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  @Post('webhook')
  @ApiExcludeEndpoint()
  async handleStripeWebhook(@Body() event: any, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Handling Stripe webhook:', event);
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments/webhook`;
    console.log('API Gateway: Webhook URL:', url);
    
    try {
      console.log('API Gateway: Making webhook request to payment service...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      
      console.log('API Gateway: Webhook response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Webhook response data:', data);
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error handling webhook:', error);
      res.status(500).json({ message: 'Payment service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  @Post(':id/confirm')
  @ApiOperation({ 
    summary: 'Confirmar pago completado',
    description: 'Confirma que un pago fue completado exitosamente y actualiza la reservación (Available to all authenticated users)'
  })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago confirmado exitosamente',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @ApiResponse({ status: 400, description: 'Pago ya confirmado o fallido' })
  @ApiSecurity('bearer')
  async confirmPayment(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Confirming payment:', id);
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments/${id}/confirm`;
    console.log('API Gateway: Confirm payment URL:', url);
    
    try {
      console.log('API Gateway: Making confirm payment request...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Gateway: Confirm payment response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Confirm payment response data:', data);
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error confirming payment:', error);
      res.status(500).json({ message: 'Payment service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  @Post(':id/fail')
  @ApiOperation({ 
    summary: 'Marcar pago como fallido',
    description: 'Marca un pago como fallido y cancela la reservación asociada (Available to all authenticated users)'
  })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago marcado como fallido exitosamente',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @ApiSecurity('bearer')
  async failPayment(@Param('id') id: string, @CurrentUser() user: any, @Req() req: Request, @Res() res: Response) {
    console.log('API Gateway: Failing payment:', id);
    const url = `${process.env.PAYMENT_SERVICE_URL}/payments/${id}/fail`;
    console.log('API Gateway: Fail payment URL:', url);
    
    try {
      console.log('API Gateway: Making fail payment request...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Gateway: Fail payment response status:', response.status);
      const data = await response.json();
      console.log('API Gateway: Fail payment response data:', data);
      
      res.status(response.status).json(data);
    } catch (error) {
      console.error('API Gateway: Error failing payment:', error);
      res.status(500).json({ message: 'Payment service error', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

}
