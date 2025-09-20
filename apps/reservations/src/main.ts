import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './infrastructure/http/module/reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger));
  
  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Reservations Service API')
    .setDescription('API de gestión de reservaciones')
    .setVersion('1.0')
    .addTag('reservations', 'Gestión de reservaciones')
    .addBearerAuth()
    .addCookieAuth('Authentication')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const configService = app.get(ConfigService);
  const port = configService.get<string | number>('PORT');
  if (port === undefined) {
    throw new Error('PORT is not defined in configuration');
  }
  await app.listen(port);
}
bootstrap();