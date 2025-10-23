import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { CreateChargeDto } from '@/libs/common/src/dto/create-charge.dto';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  GetPaymentsDto,
  PaymentResponseDto,
  PaginatedResponseDto
} from '../dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-08-27.basil',
      },
    );
  }

  async createCharge({ amount }: CreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      confirm: true,
      payment_method: 'pm_card_visa',
      currency: 'usd',
    });

    return paymentIntent;
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponseDto> {
    try {
      const { amount, currency = 'usd', description, customer_email, reservation_id } = createPaymentDto;

      // Create payment method
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: { token: createPaymentDto.token || 'tok_visa' }, // usa el token enviado o uno por defecto
      });


      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method: paymentMethod.id,
        description: description,
        metadata: {
          reservation_id: reservation_id || '',
          customer_email: customer_email || '',
        },
        confirm: true,
        return_url: 'https://example.com/return',
      });

      return this.mapStripePaymentToResponse(paymentIntent);
    } catch (error) {
      throw new BadRequestException(`Payment creation failed: ${error.message}`);
    }
  }

  async getPayments(query: GetPaymentsDto): Promise<PaginatedResponseDto<PaymentResponseDto>> {
    try {
      const { page = 1, limit = 10, status } = query;

      const paymentIntents = await this.stripe.paymentIntents.list({
        limit,
        starting_after: page > 1 ? `pi_${(page - 1) * limit}` : undefined,
      });

      let payments = paymentIntents.data.map(payment => this.mapStripePaymentToResponse(payment));

      if (status) {
        payments = payments.filter(p => p.status === status);
      }

      return {
        data: payments,
        page,
        limit,
        total: payments.length,
        totalPages: Math.ceil(payments.length / limit),
        hasNext: paymentIntents.has_more,
        hasPrev: page > 1,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to retrieve payments: ${error.message}`);
    }
  }


  async getPayment(id: string): Promise<PaymentResponseDto> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(id);
      return this.mapStripePaymentToResponse(paymentIntent);
    } catch (error) {
      if (error.code === 'resource_missing') {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      throw new BadRequestException(`Failed to retrieve payment: ${error.message}`);
    }
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentResponseDto> {
    try {
      const { status, description } = updatePaymentDto;

      const updateParams: Stripe.PaymentIntentUpdateParams = {};

      if (description) {
        updateParams.description = description;
      }

      const paymentIntent = await this.stripe.paymentIntents.update(id, updateParams);

      return this.mapStripePaymentToResponse(paymentIntent);
    } catch (error) {
      if (error.code === 'resource_missing') {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      throw new BadRequestException(`Failed to update payment: ${error.message}`);
    }
  }

  async cancelPayment(id: string): Promise<PaymentResponseDto> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(id);
      return this.mapStripePaymentToResponse(paymentIntent);
    } catch (error) {
      if (error.code === 'resource_missing') {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      if (error.code === 'payment_intent_cancel_failed') {
        throw new BadRequestException('Payment cannot be canceled');
      }
      throw new BadRequestException(`Failed to cancel payment: ${error.message}`);
    }
  }

  private mapStripePaymentToResponse(paymentIntent: Stripe.PaymentIntent): PaymentResponseDto {
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      created: paymentIntent.created,
      currency: paymentIntent.currency,
      description: paymentIntent.description || undefined,
    };
  }
}
