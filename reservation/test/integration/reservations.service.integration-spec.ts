import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from '../../src/application/service/reservations.service';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE } from '../../src/libs/common/src/constants/service';
import { of } from 'rxjs';
import { CreateReservationDto } from '../../src/application/dto/create-reservation.dto';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from '../../src/domain/entity/reservation.entity';

describe('ReservationsService Integration Tests (TypeORM SQLite in-memory)', () => {
  let service: ReservationsService;
  let dataSource: DataSource;
  let typeormRepo: Repository<Reservation>;
  let mockPaymentsClient: Partial<ClientProxy>;

  // Adapter ligero que expone los métodos que ReservationsService espera
  class ReservationsRepositoryAdapter {
    constructor(private repo: Repository<Reservation>) {}

    async create(data: any) {
      const entity = this.repo.create(data as any);
      return this.repo.save(entity);
    }

    async find(query: any) {
      return this.repo.find();
    }

    async findOne(query: any) {
      return this.repo.findOneBy({ id: query.id });
    }

    async findOneAndUpdate(query: any, update: any) {
      await this.repo.update({ id: query.id }, update);
      return this.repo.findOneBy({ id: query.id });
    }

    async findOneAndDelete(query: any) {
      const obj = await this.repo.findOneBy({ id: query.id });
      if (obj) await this.repo.remove(obj);
      return obj;
    }
  }

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [Reservation],
    });
    await dataSource.initialize();
    typeormRepo = dataSource.getRepository(Reservation);

    mockPaymentsClient = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: PAYMENTS_SERVICE, useValue: mockPaymentsClient },
      ],
    }).compile();

    // Obtener la instancia del servicio e inyectar el repository adapter manualmente
    service = module.get<ReservationsService>(ReservationsService);
    // @ts-expect-error - inyectamos internamente la propiedad privada para pruebas
    service['reservationsRepository'] = new ReservationsRepositoryAdapter(typeormRepo) as any;
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) await dataSource.destroy();
  });

  afterEach(async () => {
    await typeormRepo.clear();
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear una reservación después de un cargo exitoso', async () => {
      const createDto: CreateReservationDto = {
        startDate: new Date(),
        endDate: new Date(),
        // algunos DTOs pueden incluir placeId; no se requiere por la entidad actual
        charge: { amount: 100 },
      } as any;

      const userId = 'user123';
      const paymentResponse = { id: 'invoice456', status: 'succeeded' };

      (mockPaymentsClient.send as jest.Mock).mockReturnValue(of(paymentResponse));

      const resultObservable = await service.create(createDto, userId);
      // El servicio devuelve un Observable que emite una Promise (por el map async),
      // por eso resolvemos la promesa y luego la promesa interna si existe.
      const intermediate = await resultObservable.toPromise();
      const result = intermediate instanceof Promise ? await intermediate : intermediate;

      // Verificar la interacción con el mock
      expect(mockPaymentsClient.send).toHaveBeenCalledWith('create_charge', createDto.charge);

      // Verificar el resultado del servicio
      expect(result.invoiceId).toBe(paymentResponse.id);
      expect(result.userId).toBe(userId);

      // Verificar en la base de datos
      const reservationInDb = await typeormRepo.findOneBy({ id: result.id });
      expect(reservationInDb).not.toBeNull();
      expect(reservationInDb.invoiceId).toBe(paymentResponse.id);
    });
  });
});
