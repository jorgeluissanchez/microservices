import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';

import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '@/interface/http/controller/auth.controller';
import { AuthService } from '@/application/service/auth.service';
import { UsersModule } from '@/interface/http/module/users.module';
import { LocalStrategy } from '@/interface/http/strategies/local.strategy';
import { JwtStrategy } from '@/interface/http/strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      }),
    }),
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          transport: configService.get('NODE_ENV') === 'production' 
            ? undefined 
            : {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
