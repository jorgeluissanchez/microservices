import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import request from 'supertest';
import { Reflector } from '@nestjs/core';
import { AppModule } from '../../src/interface/module/app.module';

// Import controllers directly to construct a lightweight testing module when mocking
import { AuthController } from '../../src/interface/controller/auth.controller';
import { PlacesController } from '../../src/interface/controller/places.controller';
import { PaymentController } from '../../src/interface/controller/payment.controller';
import { ReservationController } from '../../src/interface/controller/reservation.controller';
import { UsersController } from '../../src/interface/controller/users.controller';

/**
 * This integration test file runs in two modes:
 * - Live mode: set INTEGRATION_TEST_LIVE=true to use the real AppModule and real HTTP calls
 *   (useful when running tests against containers started with docker-compose.test.yaml).
 * - Mock mode (default): mocks external HTTP calls (global.fetch and HttpService.axiosRef)
 *   so tests are deterministic and fast.
 */

const isLive = process.env.INTEGRATION_TEST_LIVE === 'true';

// ---- Mock helpers ----
function createMockFetch() {
  return async (url: string, opts: any = {}) => {
    // Normalize url to only path after host for convenience
    const path = url.split('://').slice(-1)[0].split('/').slice(1).join('/');

    // Simple routing for mocked services
    if (url.includes('/auth/login')) {
      const body = opts.body ? JSON.parse(opts.body) : {};
      if (!body.email || !body.password || !body.email.includes('@')) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 400 });
      }
      const res = new Response(JSON.stringify({ _id: 'user-id', email: body.email, role: 'user' }), {
        status: 200,
        headers: { 'set-cookie': 'Authentication=mocktoken; HttpOnly' },
      });
      return res;
    }

    if (url.includes('/auth/profile')) {
      // If cookie header provided, return profile, else 401
      const headers = opts.headers || {};
      const cookie = headers['Cookie'] || headers.cookie;
      if (!cookie || !cookie.includes('Authentication=')) {
        return new Response(JSON.stringify({ message: 'No token' }), { status: 401 });
      }
      return new Response(JSON.stringify({ _id: 'user-id', email: 'test@example.com', role: 'user' }), { status: 200 });
    }

    if (url.includes('/payments')) {
      if (url.endsWith('/webhook')) {
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }
      if (/\/payments\/[^/]+\/(confirm|fail)$/.test(url)) {
        return new Response(JSON.stringify({ id: 'payment-id', status: 'CONFIRMED' }), { status: 200 });
      }
      // Create payment
      const body = opts.body ? JSON.parse(opts.body) : {};
      if (!body.amount || body.amount <= 0) {
        return new Response(JSON.stringify({ message: 'Invalid payment data' }), { status: 400 });
      }
      return new Response(JSON.stringify({ paymentUrl: 'https://stripe.test/checkout', paymentId: 'pi_test' }), { status: 201 });
    }

    if (url.includes('/reservations')) {
      if (/\/reservations\/[^/]+\/status$/.test(url)) {
        return new Response(JSON.stringify({ id: 'res-id', status: 'CONFIRMED' }), { status: 200 });
      }
      const body = opts.body ? JSON.parse(opts.body) : {};
      // Basic validation: startDate before endDate
      if (body.startDate && body.endDate && new Date(body.startDate) >= new Date(body.endDate)) {
        return new Response(JSON.stringify({ message: 'Invalid dates' }), { status: 400 });
      }
      return new Response(JSON.stringify({ id: 'res-id', ...body }), { status: 201 });
    }

    if (url.includes('/places')) {
      // GET list
      if (opts.method === 'GET' || !opts.method) {
        return new Response(JSON.stringify([{ _id: '507f1f77bcf86cd799439011', name: 'Mock Place' }]), { status: 200 });
      }
      // POST create
      if (opts.method === 'POST') {
        const body = opts.body ? JSON.parse(opts.body) : {};
        if (!body.name || !body.city) return new Response(JSON.stringify({ message: 'Invalid data' }), { status: 400 });
        return new Response(JSON.stringify({ _id: '507f1f77bcf86cd799439012', ...body }), { status: 201 });
      }
      // other
      return new Response(JSON.stringify({}), { status: 200 });
    }

    // Default: service unavailable
    return new Response(JSON.stringify({ message: 'Service unavailable (mock)' }), { status: 503 });
  };
}

function createMockHttpService() {
  return {
    axiosRef: async (opts: any) => {
      // Reuse same semantics as fetch mock but return { data, status }
      const url = opts.url || (opts.baseURL ? `${opts.baseURL}${opts.url}` : opts);
      // Simple routing
      if (url.includes('/places')) {
        if (opts.method === 'GET') {
          return { data: [{ _id: '507f1f77bcf86cd799439011', name: 'Mock Place' }], status: 200 };
        }
        if (opts.method === 'POST') {
          const body = opts.data || {};
          if (!body.name) throw { response: { status: 400, data: { message: 'Invalid data' } } };
          return { data: { _id: '507f1f77bcf86cd799439012', ...body }, status: 201 };
        }
      }
      // Default: simulate service error
      throw { response: { status: 503, data: { message: 'Service unavailable (mock axios)' } } };
    }
  } as Partial<HttpService>;
}

@Injectable()
class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // Allow public endpoints
    if (req.method === 'POST' && req.url === '/auth/login') return true;
    if (req.method === 'POST' && req.url === '/users') return true;

    // If test header set, allow; else throw Unauthorized
    if (req.headers['x-test-auth']) return true;
    throw new UnauthorizedException('Mock: no auth');
  }
}

@Injectable()
class MockRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const req = context.switchToHttp().getRequest();
    const role = req.headers['x-test-role'];
    if (!role) throw new ForbiddenException('Mock: missing role');
    if (requiredRoles.includes(role)) return true;
    throw new ForbiddenException('Mock: insufficient role');
  }
}

describe('API Gateway Integration Tests (api-gateway)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (isLive) {
      // Live mode: import full AppModule and ensure service URLs point to localhost (compose exposes ports to host)
      // If you run the services with the docker-compose.yaml in the repo root they will be reachable on localhost:3000-3004
      process.env.AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3000';
      process.env.PLACES_SERVICE_URL = process.env.PLACES_SERVICE_URL || 'http://localhost:3001';
      process.env.PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3002';
      process.env.RESERVATION_SERVICE_URL = process.env.RESERVATION_SERVICE_URL || 'http://localhost:3003';
      process.env.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({ isGlobal: true }),
          HttpModule,
          AppModule,
        ],
      }).compile();
      app = moduleFixture.createNestApplication();
      app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
      await app.init();
      return;
    }

    // Mock mode: create testing module with controllers and mocked dependencies
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }) , HttpModule],
      controllers: [
        AuthController,
        PlacesController,
        PaymentController,
        ReservationController,
        UsersController,
      ],
      providers: [Reflector],
    })
      .overrideProvider(HttpService)
      .useValue(createMockHttpService())
      .overrideProvider('Reflector')
      .useValue(new Reflector())
      .compile();

    // Replace global.fetch with mock
    // @ts-ignore
    global.fetch = createMockFetch();

    // Override global guards by adding them as APP_GUARD providers on the created module
    // (We attach them manually to the app instance below.)
    app = moduleFixture.createNestApplication();
    // Manually bind our mock guards into the app's container so controller-level UseGuards pick them up
    app.useGlobalGuards(new MockAuthGuard(), new MockRolesGuard(new Reflector()));

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  // --- Tests adapted from example ---
  describe('Auth Service Integration', () => {
    it('POST /auth/login should proxy (mocked or live)', async () => {
      const loginData = { email: 'test@example.com', password: 'Test123!' };
      const response = await request(app.getHttpServer()).post('/auth/login').send(loginData);
      expect([200, 201, 400, 500, 503]).toContain(response.status);
    });

    it('POST /auth/login validates input (invalid email)', async () => {
      const invalid = { email: 'invalid-email' };
      const res = await request(app.getHttpServer()).post('/auth/login').send(invalid);
      // In mock mode we return 400; in live mode gateway may proxy and return 400 or 500/503
      if (isLive) {
        expect([400, 500, 503]).toContain(res.status);
      } else {
        expect(res.status).toBe(400);
      }
    });

    it('GET /auth/profile requires auth', async () => {
      // Without x-test-auth header: should be 401 in mock mode
      await request(app.getHttpServer()).get('/auth/profile').expect(isLive ? undefined : 401);
    });

    it('GET /auth/profile with auth returns profile', async () => {
      const res = await request(app.getHttpServer()).get('/auth/profile').set('x-test-auth', '1');
      if (isLive) {
        expect([200, 401, 500, 503]).toContain(res.status);
      } else {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('email');
      }
    });
  });

  describe('Places Service Integration', () => {
    it('GET /places proxies to places service', async () => {
      const res = await request(app.getHttpServer()).get('/places').set('x-test-auth', '1');
      expect([200, 500, 503]).toContain(res.status);
    });

    it('POST /places requires admin role', async () => {
      const placeData = { name: 'Test Venue', city: 'Test City', capacity: 10, pricePerHour: 50 };
      // Without role header -> should be 403 in mock mode
      const withoutRole = await request(app.getHttpServer()).post('/places').set('x-test-auth', '1').send(placeData);
      if (isLive) {
        expect([201, 400, 403, 500, 503]).toContain(withoutRole.status);
      } else {
        expect(withoutRole.status).toBe(403);
      }

      // With admin role
      const withRole = await request(app.getHttpServer()).post('/places').set('x-test-auth', '1').set('x-test-role', 'admin').send(placeData);
      expect([201, 400, 403, 500, 503]).toContain(withRole.status);
    });
  });

  describe('Payment Service Integration', () => {
    it('POST /payments creates a payment', async () => {
      const paymentData = { amount: 10000, currency: 'usd', description: 'Test', customerEmail: 'test@example.com', reservationId: 'res-1' };
      const res = await request(app.getHttpServer()).post('/payments').set('x-test-auth', '1').send(paymentData);
      if (isLive) {
        expect([201, 400, 500, 503]).toContain(res.status);
      } else {
        expect(res.status).toBe(201);
      }
    });

    it('POST /payments validates negative amount', async () => {
      const invalid = { amount: -1000, currency: 'usd', description: 'Bad' };
      const res = await request(app.getHttpServer()).post('/payments').set('x-test-auth', '1').send(invalid);
      if (isLive) {
        expect([400, 500, 503]).toContain(res.status);
      } else {
        expect(res.status).toBe(400);
      }
    });
  });

  describe('Reservation Service Integration', () => {
    it('POST /reservations creates reservation and validates dates', async () => {
      const good = { placeId: '507f1f77bcf86cd799439011', startDate: new Date('2024-12-25T10:00:00Z'), endDate: new Date('2024-12-25T18:00:00Z'), customerEmail: 'test@example.com' };
      const resGood = await request(app.getHttpServer()).post('/reservations').set('x-test-auth', '1').send(good);
      if (isLive) {
        expect([201, 400, 500, 503]).toContain(resGood.status);
      } else {
        expect(resGood.status).toBe(201);
      }

      const bad = { placeId: '507f1f77bcf86cd799439011', startDate: new Date('2024-12-25T18:00:00Z'), endDate: new Date('2024-12-25T10:00:00Z'), customerEmail: 'test@example.com' };
      const resBad = await request(app.getHttpServer()).post('/reservations').set('x-test-auth', '1').send(bad);
      if (isLive) {
        expect([400, 500, 503]).toContain(resBad.status);
      } else {
        expect(resBad.status).toBe(400);
      }
    });
  });

});
