import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from '@/application/service/payments.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

jest.mock('stripe');

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockStripe: any;

  beforeEach(async () => {
    mockStripe = {
      paymentIntents: {
        create: jest.fn().mockResolvedValue({ id: 'pi_test', amount: 1000, status: 'succeeded', currency: 'usd', created: 123 }),
      },
      paymentMethods: {
        create: jest.fn().mockResolvedValue({ id: 'pm_test' }),
      },
    };

    (Stripe as jest.Mock).mockImplementation(() => mockStripe);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('fake_key') },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('debería crear un pago exitosamente', async () => {
    const result = await service.createPayment({
      amount: 1000,
      card: { number: '4242424242424242', exp_month: 12, exp_year: 25, cvc: '123' },
    } as any);

    expect(mockStripe.paymentMethods.create).toHaveBeenCalled();
    expect(mockStripe.paymentIntents.create).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ id: 'pi_test', status: 'succeeded' }));
  });
});
