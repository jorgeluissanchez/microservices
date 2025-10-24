import { NestFactory } from '@nestjs/core';
import { AppModule } from './interface/module/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parsing
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS with specific configuration
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Accept, Origin, X-Requested-With',
  });

  // Swagger consolidado para todos los microservicios
  const config = new DocumentBuilder()
    .setTitle('API Gateway - Microservices Platform')
    .setDescription(`
      # API Gateway - Plataforma de Microservicios
      
      Esta es la documentación unificada del API Gateway que agrupa todos los microservicios de la plataforma:
      
      ## Servicios Disponibles
      
      ### 🔐 Authentication Service
      - **Autenticación**: Login, registro y gestión de usuarios
      - **Autorización por roles**: Sistema de permisos (user/admin)
      - **Gestión de perfiles**: Información del usuario autenticado
      
      ### 💳 Payment Service  
      - **Procesamiento de pagos**: Integración con Stripe
      - **Gestión de pagos**: Crear, consultar, actualizar y cancelar pagos
      - **Filtros y paginación**: Búsqueda avanzada de transacciones
      
      ### 🏨 Reservation Service
      - **Gestión de reservaciones**: Crear, consultar, actualizar y eliminar reservas
      - **Integración con pagos**: Procesamiento automático de pagos al crear reservas
      
      ### 🏢 Places Service
      - **Gestión de lugares**: Crear, consultar, actualizar y eliminar lugares
      - **Búsqueda de lugares**: Filtros y búsqueda avanzada
      
      ## Flujo de Trabajo Típico
      
      1. **Registro/Login**: \`POST /users\` o \`POST /auth/login\` para autenticarse
      2. **Crear Reservación**: \`POST /reservations\` (procesa pago automáticamente)
      3. **Consultar Pagos**: \`GET /payments\` para ver historial
      4. **Gestionar Reservas**: \`GET /reservations\`, \`PATCH /reservations/:id\`
      5. **Gestionar Lugares**: \`GET /places\`, \`POST /places\` (solo admin), \`PATCH /places/:id\` (solo admin)
    `)
    .setVersion('1.0.0')
    .setContact('Equipo de Desarrollo', 'https://github.com/your-org/microservices', 'dev@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    // Tags organizados por servicio
    .addTag('auth', '🔐 Autenticación - Login, registro y gestión de usuarios')
    .addTag('users', '👥 Usuarios - Gestión de cuentas de usuario')
    .addTag('payments', '💳 Pagos - Procesamiento y gestión de transacciones')
    .addTag('reservations', '🏨 Reservaciones - Gestión de reservas y alojamientos')
    .addTag('places', '🏢 Lugares - Gestión de lugares y alojamientos')
    // Servidores
    .addServer('http://localhost:3004', 'API Gateway - Desarrollo Local')
    .addServer('https://api-gateway.example.com', 'API Gateway - Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3004;
  await app.listen(port);
  console.log(`🚀 API Gateway running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/api`);
}
bootstrap();
