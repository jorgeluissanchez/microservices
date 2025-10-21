import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from '@/application/service/reservations.service';
import { ReservationsRepository } from '@/infrastructure/repository/reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let repo: ReservationsRepository;
  let clientProxy: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: ReservationsRepository,
          useValue: {
            create: jest.fn().mockResolvedValue({ id: 'res1', placeId: 'place123' }),
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 'res1' }),
            findOneAndUpdate: jest.fn().mockResolvedValue({ id: 'res1', updated: true }),
            findOneAndDelete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
        {
          provide: 'PAYMENTS_SERVICE',
          useValue: { send: jest.fn().mockReturnValue(of({ id: 'pi_test' })) },
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    repo = module.get<ReservationsRepository>(ReservationsRepository);
    clientProxy = module.get<ClientProxy>('PAYMENTS_SERVICE');
  });

  it('debería crear una reservación y procesar el pago', async () => {
    const dto = { charge: { amount: 1000 } } as any;
    const result$ = await service.create(dto, 'user123');
    const result = await result$.toPromise();

    expect(clientProxy.send).toHaveBeenCalledWith('create_charge', dto.charge);
    expect(repo.create).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({ id: 'res1' }));
  });
});
