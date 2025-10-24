import request from 'supertest';

// Use ports from docker-compose: api-gateway 3000, auth 3001, payment 3002, reservation 3003
const GATEWAY = process.env.GATEWAY_URL || 'http://localhost:3000';
const AUTH = process.env.AUTH_URL || 'http://localhost:3001';
const PAYMENT = process.env.PAYMENT_URL || 'http://localhost:3002';
const RESERVATION = process.env.RESERVATION_URL || 'http://localhost:3003';

describe('Integración (docker-compose) - flujo completo vía API Gateway', () => {
  let jwtCookie: string | undefined;
  let reservationId: string | undefined;

  it('registro y login a través del API Gateway', async () => {
    // Registrar usando el endpoint del gateway que enruta a auth
    const registerRes = await request(GATEWAY)
      .post('/auth/register')
      .send({ email: 'e2e_user@example.com', password: 'e2e_password' });

    expect([200, 201]).toContain(registerRes.status);

    // Login (esperamos que setee la cookie "Authentication")
    const loginRes = await request(GATEWAY)
      .post('/auth/login')
      .send({ email: 'e2e_user@example.com', password: 'e2e_password' });

    expect([200, 201]).toContain(loginRes.status);
    // Guardar cookie
    const setCookie = loginRes.header['set-cookie'];
    if (setCookie && setCookie.length) jwtCookie = setCookie.join(';');
    expect(jwtCookie).toBeDefined();
  }, 20000);

  it('crear reservación y pago vía API Gateway usando cookie', async () => {
    expect(jwtCookie).toBeDefined();

    // Crear reserva
    const reservationPayload = { date: '2025-12-10', details: 'Prueba e2e', charge: { amount: 100 } };
    const resRes = await request(GATEWAY)
      .post('/reservations')
      .set('Cookie', jwtCookie!)
      .send(reservationPayload);

    expect([200, 201]).toContain(resRes.status);
    reservationId = resRes.body?.id || resRes.body?._id;
    expect(reservationId).toBeDefined();

    // Crear pago asociado (si el flujo de gateway expone /payments)
    const paymentPayload = { amount: 100, description: 'Pago e2e', reservation_id: reservationId };
    const payRes = await request(GATEWAY)
      .post('/payments')
      .set('Cookie', jwtCookie!)
      .send(paymentPayload);

    expect([200, 201]).toContain(payRes.status);
    expect(payRes.body).toHaveProperty('id');
  }, 30000);
});
