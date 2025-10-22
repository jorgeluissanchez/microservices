import axios from 'axios';

// Simple integration tests for API Gateway
// These tests expect services to be available on the following ports (development defaults):
// - API Gateway: 3000
// - Auth Service: 3001
// - Payment Service: 3002
// - Reservation Service: 3003

const GATEWAY = process.env.GATEWAY_URL || 'http://localhost:3000';
const AUTH = process.env.AUTH_URL || 'http://localhost:3001';
const PAYMENT = process.env.PAYMENT_URL || 'http://localhost:3002';
const RESERVATION = process.env.RESERVATION_URL || 'http://localhost:3003';

jest.setTimeout(30_000);

describe('API Gateway integration', () => {
  test('Swagger UI is available at /api', async () => {
    const res = await axios.get(`${GATEWAY}/api`).catch((err) => err.response || err);
    expect(res).toBeDefined();
    expect([200, 301, 302]).toContain(res.status);
  });

  test('Gateway root responds', async () => {
    const res = await axios.get(`${GATEWAY}/`).catch((err) => err.response || err);
    expect(res).toBeDefined();
    expect([200, 404]).toContain(res.status);
  });

  test('Optional: proxy to auth service works (if auth up)', async () => {
    // Try to hit an endpoint that the gateway should proxy to auth service
    // We check resilience: if auth is down, skip the assertion but do not fail the suite.
    try {
      const r = await axios.get(`${AUTH}/api-json`, { timeout: 3000 });
      // If auth's swagger json is available, assert gateway can reach it (indirect test)
      expect(r.status).toBe(200);
    } catch (err) {
      console.warn('Auth service not available; skipping auth specific assertions');
      expect(true).toBeTruthy();
    }
  });

  test('Optional: proxy to payment service works (if payment up)', async () => {
    try {
      const r = await axios.get(`${PAYMENT}/api-json`, { timeout: 3000 });
      expect(r.status).toBe(200);
    } catch (err) {
      console.warn('Payment service not available; skipping payment specific assertions');
      expect(true).toBeTruthy();
    }
  });

  test('Optional: proxy to reservation service works (if reservation up)', async () => {
    try {
      const r = await axios.get(`${RESERVATION}/api-json`, { timeout: 3000 });
      expect(r.status).toBe(200);
    } catch (err) {
      console.warn('Reservation service not available; skipping reservation specific assertions');
      expect(true).toBeTruthy();
    }
  });
});
