import { Client } from 'pg';

describe('DB Connection - Reservation Service (Postgres)', () => {
  let client: Client;
  const connectionString = process.env.RESERVATION_DATABASE_URL;

  beforeAll(() => {
    if (!connectionString) {
      throw new Error('La variable de entorno RESERVATION_DATABASE_URL no está definida.');
    }
    client = new Client({ connectionString });
  });

  afterAll(async () => {
    if (client) {
      await client.end();
    }
  });

  it('debería conectarse a Postgres y ejecutar una consulta simple', async () => {
    await expect(client.connect()).resolves.not.toThrow();
    
    const res = await client.query('SELECT 1 as ok');
    expect(res.rows[0].ok).toBe(1);
  }, 15000);
});
