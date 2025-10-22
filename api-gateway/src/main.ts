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
    .setTitle('API Gateway - Consolidated API')
    .setDescription('Documentación unificada del API Gateway que agrupa los microservicios: Auth, Payment y Reservation')
    .setVersion('1.0')
    // Auth service
    .addTag('auth', 'Endpoints del servicio de autenticación')
    // Payment service
    .addTag('payments', 'Endpoints del servicio de pagos')
    // Reservation service
    .addTag('reservations', 'Endpoints del servicio de reservaciones')
    // Seguridad: bearer + cookie (muchos microservicios usan ambos)
    .addBearerAuth()
    .addCookieAuth('Authentication')
    // Servers: apuntan a los puertos por defecto esperados en desarrollo
    .addServer('http://localhost:3000', 'API Gateway (local)')
    .addServer('http://localhost:3001', 'Auth Service (local)')
    .addServer('http://localhost:3002', 'Payment Service (local)')
    .addServer('http://localhost:3003', 'Reservation Service (local)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API Gateway running on http://localhost:${port}`);
}
bootstrap();
