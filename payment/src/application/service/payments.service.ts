import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentsRepository } from '@/infrastructure/repository/payments.repository';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentResponseDto, PaymentStatus } from '../dto/payment-response.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentsRepository: PaymentsRepository,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-08-27.basil',
      },
    );
  }

  async generatePaymentUrl(createPaymentDto: CreatePaymentDto): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      const { amount, currency = 'usd', description, customer_email, reservation_id } = createPaymentDto;

      // Create a Stripe Checkout Session instead of PaymentIntent for better UX
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: description || 'Reservation Payment',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancel`,
        customer_email: customer_email,
        metadata: {
          reservation_id: reservation_id || '',
          customer_email: customer_email || '',
        },
      });

      // Save payment to database
      const payment = await this.paymentsRepository.create({
        stripePaymentIntentId: session.id, // Using session ID instead of payment intent
        amount: amount,
        currency: currency,
        status: PaymentStatus.PENDING,
        description: description,
        customerEmail: customer_email,
        reservationId: reservation_id,
        createdAt: new Date(),
      });

      return {
        paymentUrl: session.url!, // This is the correct Stripe checkout URL
        paymentId: payment.id,
      };
    } catch (error) {
      throw new BadRequestException(`Payment generation failed: ${error.message}`);
    }
  }

  async getPayments(userId?: string): Promise<PaymentResponseDto[]> {
    const query = userId ? { customerEmail: userId } : {};
    const payments = await this.paymentsRepository.find(query);
    return payments.map(payment => this.mapToResponseDto(payment));
  }

  async getPaymentById(id: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentsRepository.findOne(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return this.mapToResponseDto(payment);
  }

  async getRawPaymentById(id: string): Promise<any> {
    const payment = await this.paymentsRepository.findOne(id);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async handleStripeWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    console.log('Processing checkout session completed:', session.id);
    
    // Find payment by session ID
    const payment = await this.paymentsRepository.findByStripePaymentIntentId(session.id);
    if (!payment) {
      console.error('Payment not found for session ID:', session.id);
      return;
    }

    console.log('Found payment:', payment.id, 'Current status:', payment.status);

    // Check if payment is already processed
    if (payment.status === PaymentStatus.SUCCEEDED) {
      console.log('Payment already confirmed, skipping');
      return;
    }

    // Update payment status
    await this.paymentsRepository.update(payment.id, {
      status: PaymentStatus.SUCCEEDED,
      updatedAt: new Date(),
    });

    console.log('Payment status updated to SUCCEEDED');

    // Confirm reservation using fetch
    if (payment.reservationId) {
      try {
        const reservationServiceUrl = process.env.RESERVATION_SERVICE_URL || 'http://localhost:3003';
        console.log('Confirming reservation:', payment.reservationId);
        
        const response = await fetch(`${reservationServiceUrl}/reservations/${payment.reservationId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'CONFIRMED',
            paymentId: payment.id,
          }),
        });
        
        if (response.ok) {
          console.log('Reservation confirmed successfully');
        } else {
          const errorText = await response.text();
          console.error('Failed to confirm reservation:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error confirming reservation:', error);
      }
    } else {
      console.log('No reservation ID associated with payment');
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update payment status in database
    const payment = await this.paymentsRepository.findByStripePaymentIntentId(paymentIntent.id);
    if (payment) {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.SUCCEEDED,
        updatedAt: new Date(),
      });

      // Confirm reservation using fetch
      try {
        const reservationServiceUrl = process.env.RESERVATION_SERVICE_URL || 'http://localhost:3003';
        const response = await fetch(`${reservationServiceUrl}/reservations/${payment.reservationId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'CONFIRMED',
            paymentId: payment.id,
          }),
        });
        
        if (response.ok) {
          console.log('Reservation confirmed successfully');
        } else {
          console.error('Failed to confirm reservation:', response.status);
        }
      } catch (error) {
        console.error('Error confirming reservation:', error);
      }
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('Processing payment failed:', paymentIntent.id);
    
    // Update payment status in database
    const payment = await this.paymentsRepository.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) {
      console.error('Payment not found for payment intent ID:', paymentIntent.id);
      return;
    }

    console.log('Found payment:', payment.id, 'Current status:', payment.status);

    // Check if payment is already processed
    if (payment.status === PaymentStatus.FAILED || payment.status === PaymentStatus.SUCCEEDED) {
      console.log('Payment already processed, skipping');
      return;
    }

    await this.paymentsRepository.update(payment.id, {
      status: PaymentStatus.FAILED,
      updatedAt: new Date(),
    });

    console.log('Payment status updated to FAILED');

    // Reject reservation using fetch
    if (payment.reservationId) {
      try {
        const reservationServiceUrl = process.env.RESERVATION_SERVICE_URL || 'http://localhost:3003';
        console.log('Rejecting reservation:', payment.reservationId);
        
        const response = await fetch(`${reservationServiceUrl}/reservations/${payment.reservationId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'REJECTED',
            reason: 'Payment failed',
          }),
        });
        
        if (response.ok) {
          console.log('Reservation rejected due to payment failure');
        } else {
          const errorText = await response.text();
          console.error('Failed to reject reservation:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error rejecting reservation:', error);
      }
    } else {
      console.log('No reservation ID associated with payment');
    }
  }

  private mapToResponseDto(payment: any): PaymentResponseDto {
    return {
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      created: payment.createdAt,
      currency: payment.currency,
      description: payment.description,
      customerEmail: payment.customerEmail,
      reservationId: payment.reservationId,
    };
  }
}
