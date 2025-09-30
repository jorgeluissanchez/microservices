import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { GatewayModule } from '@/interface/http/module/gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  
  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
