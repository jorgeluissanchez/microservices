import request from 'supertest';

describe('Integración: API Gateway, Auth, Payment, Reservation', () => {
  // Asume que los servicios están corriendo en los siguientes puertos:
  // api-gateway: 3000, auth: 3001, payment: 3002, reservation: 3003
  // Puedes ajustar los puertos según tu configuración real.

  let jwtToken: string;
  let userId: string;

  it('Debe registrar un usuario y loguearse (Auth)', async () => {
    // Registro
    const registerRes = await request('http://localhost:3001')
      .post('/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      });
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toHaveProperty('id');
    userId = registerRes.body.id;

    // Login
    const loginRes = await request('http://localhost:3001')
      .post('/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'testpassword',
      });
    expect(loginRes.status).toBe(201);
    expect(loginRes.body).toHaveProperty('access_token');
    jwtToken = loginRes.body.access_token;
  });

  it('Debe permitir crear un pago autenticado (Payment)', async () => {
    const paymentRes = await request('http://localhost:3002')
      .post('/payments')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        amount: 100,
        description: 'Test payment',
        userId,
      });
    expect(paymentRes.status).toBe(201);
    expect(paymentRes.body).toHaveProperty('id');
  });

  it('Debe permitir crear una reservación autenticada (Reservation)', async () => {
    const reservationRes = await request('http://localhost:3003')
      .post('/reservations')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        userId,
        date: '2025-12-01',
        details: 'Reserva de prueba',
      });
    expect(reservationRes.status).toBe(201);
    expect(reservationRes.body).toHaveProperty('id');
  });
});
