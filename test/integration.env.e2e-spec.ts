import request from 'supertest';

// Read ports from individual service env files if available or env vars
const GATEWAY = process.env.GATEWAY_URL || process.env.API_GATEWAY_URL || 'http://localhost:3000';
const AUTH = process.env.AUTH_URL || 'http://localhost:3001';
const PAYMENT = process.env.PAYMENT_URL || 'http://localhost:3002';
const RESERVATION = process.env.RESERVATION_URL || 'http://localhost:3003';

describe('Integración (env-based) - flujo completo usando servicios directos', () => {
  let token: string | undefined;
  let reservationId: string | undefined;

  it('login directo contra auth service', async () => {
    // Asume que existe un usuario creado en la DB o endpoint register
    const loginRes = await request(AUTH)
      .post('/auth/login')
      .send({ email: 'e2e_user@example.com', password: 'e2e_password' });

    expect([200, 201]).toContain(loginRes.status);
    // Token puede venir en body o cookie
    if (loginRes.body?.access_token) token = loginRes.body.access_token;
    else if (loginRes.header['set-cookie']) token = loginRes.header['set-cookie'].join(';');

    expect(token).toBeDefined();
  }, 15000);

  it('crear reservación y pago usando servicios directos', async () => {
    expect(token).toBeDefined();
    const authHeader = token!.startsWith('Bearer') ? token! : `Bearer ${token}`;

    const reservationPayload = { userId: 'user-id-placeholder', date: '2025-12-10', details: 'Prueba e2e', charge: { amount: 100 } };
    const resRes = await request(RESERVATION)
      .post('/reservations')
      .set('Authorization', authHeader)
      .send(reservationPayload);

    expect([200, 201]).toContain(resRes.status);
    reservationId = resRes.body?.id || resRes.body?._id;
    expect(reservationId).toBeDefined();

    const paymentPayload = { amount: 100, description: 'Pago e2e', reservation_id: reservationId };
    const payRes = await request(PAYMENT)
      .post('/payments')
      .set('Authorization', authHeader)
      .send(paymentPayload);

    expect([200, 201]).toContain(payRes.status);
    expect(payRes.body).toHaveProperty('id');
  }, 30000);
});
