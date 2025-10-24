import { Module } from '@nestjs/common';
import { PaymentsController } from '../controller/payments.controller';
import { PaymentsService } from '../../../application/service/payments.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from '@/libs/common/src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/domain/entity/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: {
          transport: {
            target: 'pino-pretty',
            options: {
              singleLine: true,
            },
          },
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_DATABASE: Joi.string().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      }),
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
