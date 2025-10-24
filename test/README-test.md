Instrucciones para correr las pruebas

1. Instalar dependencias (en la raíz del monorepo):

pnpm add -D jest @types/jest ts-jest supertest mongodb pg @types/supertest @types/mongodb @types/pg

2. Ejecutar tests (desde la raíz):

pnpm jest

3. Variables de entorno útiles:

- AUTH_MONGO_URI: URI de Mongo para el servicio auth
- PAYMENT_DATABASE_URL: Postgres connection string para payment
- RESERVATION_DATABASE_URL: Postgres connection string para reservation
- GATEWAY_URL, AUTH_URL, PAYMENT_URL, RESERVATION_URL: URLs base si no usas puertos por defecto del docker-compose

Notas:

- Estas pruebas suponen que los contenedores del `docker-compose.yaml` están levantados y accesibles en los puertos definidos (3000-3003). Ajusta las variables si usas otros puertos.
- Algunas pruebas intentan escribir/consultar DB. Asegúrate de usar bases de datos de prueba o ambientes que puedan ser manipulados.
