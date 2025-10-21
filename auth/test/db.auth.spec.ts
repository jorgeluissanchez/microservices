import { MongoClient } from 'mongodb';

describe('DB Connection - Auth Service (MongoDB)', () => {
  let client: MongoClient;
  const uri = process.env.AUTH_MONGO_URI;

  // Antes de todas las pruebas, nos aseguramos de que la variable de entorno esté definida.
  beforeAll(() => {
    if (!uri) {
      throw new Error('La variable de entorno AUTH_MONGO_URI no está definida. Asegúrate de cargar el entorno de prueba.');
    }
    client = new MongoClient(uri);
  });

  // Cerramos la conexión después de todas las pruebas.
  afterAll(async () => {
    if (client) {
      await client.close();
    }
  });

  it('debería conectarse a MongoDB y hacer ping a la base de datos', async () => {
    // Intentamos conectar
    await expect(client.connect()).resolves.not.toThrow();
    
    // Verificamos que la conexión está viva con un comando ping
    const db = client.db();
    const pingResult = await db.command({ ping: 1 });
    expect(pingResult.ok).toBe(1);
  }, 15000); // Aumentamos el timeout por si la primera conexión es lenta.
});
