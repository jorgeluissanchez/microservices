import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PaymentsService } from '../../../application/service/payments.service';
import { CreatePaymentDto } from '../../../application/dto/create-payment.dto';
import { PaymentResponseDto } from '../../../application/dto/payment-response.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear pago y obtener link de Stripe',
    description: 'Crea un nuevo pago y devuelve el link de Stripe para procesar el pago'
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
  async createPayment(@Body() createPaymentDto: CreatePaymentDto): Promise<{ paymentUrl: string; paymentId: string }> {
    return this.paymentsService.generatePaymentUrl(createPaymentDto);
  }

  @Post('webhook')
  @ApiOperation({ 
    summary: 'Webhook de Stripe para confirmar pagos',
    description: 'Endpoint para recibir notificaciones de Stripe sobre el estado de los pagos'
  })
  @ApiBody({
    description: 'Evento de Stripe',
    schema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          example: 'payment_intent.succeeded'
        },
        data: {
          type: 'object',
          properties: {
            object: {
              type: 'object',
              description: 'Objeto PaymentIntent de Stripe'
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook procesado exitosamente'
  })
  @ApiResponse({ status: 400, description: 'Evento de Stripe inválido' })
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(@Body() event: any): Promise<{ received: boolean }> {
    await this.paymentsService.handleStripeWebhook(event);
    return { received: true };
  }

  @Post(':id/confirm')
  @ApiOperation({ 
    summary: 'Confirmar pago completado',
    description: 'Confirma que un pago fue completado exitosamente y actualiza la reservación'
  })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago confirmado exitosamente',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @ApiResponse({ status: 400, description: 'Pago ya confirmado o fallido' })
  async confirmPayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    // This would typically be called by the Stripe webhook
    // For now, we'll simulate the confirmation
    const payment = await this.paymentsService.getPaymentById(id);
    
    // Check if payment is already confirmed
    if (payment.status === 'SUCCEEDED') {
      throw new BadRequestException('Payment is already confirmed');
    }
    
    if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
      throw new BadRequestException('Cannot confirm a failed or canceled payment');
    }
    
    // Get the raw payment entity to access stripePaymentIntentId
    const rawPayment = await this.paymentsService.getRawPaymentById(id);
    
    // Simulate successful checkout session completion (since we use Stripe Checkout)
    await this.paymentsService.handleStripeWebhook({
      type: 'checkout.session.completed',
      data: {
        object: {
          id: rawPayment.stripePaymentIntentId, // Use the session ID stored in the database
          object: 'checkout.session',
          amount_total: payment.amount,
          currency: payment.currency,
          created: Math.floor(Date.now() / 1000),
          customer_email: payment.customerEmail,
          metadata: {
            reservation_id: payment.reservationId || '',
            customer_email: payment.customerEmail || '',
          },
          payment_status: 'paid',
          status: 'complete'
        } as any
      }
    } as any);
    
    return this.paymentsService.getPaymentById(id);
  }

  @Post(':id/fail')
  @ApiOperation({ 
    summary: 'Marcar pago como fallido',
    description: 'Marca un pago como fallido y cancela la reservación asociada'
  })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  @ApiResponse({
    status: 200,
    description: 'Pago marcado como fallido exitosamente',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  async failPayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    // This would typically be called by the Stripe webhook
    // For now, we'll simulate the failure
    const payment = await this.paymentsService.getPaymentById(id);
    
    // Check if payment is already processed
    if (payment.status === 'SUCCEEDED') {
      throw new BadRequestException('Cannot fail an already confirmed payment');
    }
    
    if (payment.status === 'FAILED' || payment.status === 'CANCELED') {
      throw new BadRequestException('Payment is already failed or canceled');
    }
    
    // Get the raw payment entity to access stripePaymentIntentId
    const rawPayment = await this.paymentsService.getRawPaymentById(id);
    
    // Simulate failed payment
    await this.paymentsService.handleStripeWebhook({
      type: 'payment_intent.payment_failed',
      data: {
        object: {
          id: rawPayment.stripePaymentIntentId, // Use the session ID stored in the database
          object: 'payment_intent',
          amount: payment.amount,
          currency: payment.currency,
          created: Math.floor(Date.now() / 1000),
          client_secret: 'pi_test_secret',
          description: payment.description,
          metadata: {
            reservation_id: payment.reservationId || '',
            customer_email: payment.customerEmail || '',
          },
          payment_method: 'pm_test',
          receipt_email: payment.customerEmail,
          statement_descriptor: null,
          statement_descriptor_suffix: null,
          status: 'failed'
        } as any
      }
    } as any);
    
    return this.paymentsService.getPaymentById(id);
  }
}
