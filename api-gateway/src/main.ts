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
    .setVersion('1.0.0')
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
