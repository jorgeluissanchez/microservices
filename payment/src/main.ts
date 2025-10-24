import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './interface/http/module/payments.module';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Payment Service API')
    .setDescription('API documentation for the Payment microservice. This service handles payment processing using Stripe integration.')
    .setVersion('1.0')
    .addTag('payments', 'Payment processing operations')
    .addBearerAuth()
    .addCookieAuth('Authentication')
    .addServer('http://localhost:3002', 'Development server')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  
  const httpPort = configService.get<string | number>('HTTP_PORT');
  if (httpPort === undefined) {
    throw new Error('HTTP_PORT is not defined in configuration');
  }
  await app.listen(httpPort);
}
bootstrap();
