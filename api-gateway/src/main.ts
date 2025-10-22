import { NestFactory } from '@nestjs/core';
import { AppModule } from './interface/module/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();

  // Swagger consolidado para todos los microservicios
  const config = new DocumentBuilder()
    .setTitle('API Gateway - Microservices Platform')
    .setDescription(`
      # API Gateway - Plataforma de Microservicios
      
      Esta es la documentación unificada del API Gateway que agrupa todos los microservicios de la plataforma:
      
      ## Servicios Disponibles
      
      ### 🔐 Auth Service
      - **Autenticación de usuarios**: Login, registro y gestión de perfiles
      - **Gestión de usuarios**: Creación y consulta de usuarios
      - **Seguridad**: Autenticación basada en cookies JWT
      
      ### 💳 Payment Service  
      - **Procesamiento de pagos**: Integración con Stripe
      - **Gestión de pagos**: Crear, consultar, actualizar y cancelar pagos
      - **Filtros y paginación**: Búsqueda avanzada de transacciones
      
      ### 🏨 Reservation Service
      - **Gestión de reservaciones**: Crear, consultar, actualizar y eliminar reservas
      - **Integración con pagos**: Procesamiento automático de pagos al crear reservas
      - **Autenticación requerida**: Todas las operaciones requieren usuario autenticado
      
      ## Autenticación
      
      La mayoría de endpoints requieren autenticación mediante cookie HTTP. 
      Para autenticarse, use el endpoint \`POST /auth/login\` que establecerá automáticamente la cookie de autenticación.
      
      ## Flujo de Trabajo Típico
      
      1. **Registro/Login**: \`POST /users\` o \`POST /auth/login\`
      2. **Crear Reservación**: \`POST /reservations\` (procesa pago automáticamente)
      3. **Consultar Pagos**: \`GET /payments\` para ver historial
      4. **Gestionar Reservas**: \`GET /reservations\`, \`PATCH /reservations/:id\`
    `)
    .setVersion('1.0.0')
    .setContact('Equipo de Desarrollo', 'https://github.com/your-org/microservices', 'dev@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    // Tags organizados por servicio
    .addTag('auth', '🔐 Autenticación - Login, logout y gestión de sesiones')
    .addTag('users', '👥 Usuarios - Registro y gestión de usuarios')
    .addTag('payments', '💳 Pagos - Procesamiento y gestión de transacciones')
    .addTag('reservations', '🏨 Reservaciones - Gestión de reservas y alojamientos')
    // Seguridad
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Token JWT para autenticación (opcional)'
    })
    .addCookieAuth('Authentication', {
      type: 'apiKey',
      in: 'cookie',
      name: 'Authentication',
      description: 'Cookie de autenticación JWT (recomendado)'
    })
    // Servidores
    .addServer('http://localhost:3000', 'API Gateway - Desarrollo Local')
    .addServer('https://api-gateway.example.com', 'API Gateway - Producción')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API Gateway running on http://localhost:${port}`);
}
bootstrap();
