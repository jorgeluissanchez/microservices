import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ReservationsModule } from '@/infrastructure/http/module/reservations.module';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger));
  
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