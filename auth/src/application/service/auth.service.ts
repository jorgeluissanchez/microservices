import { Response } from 'express';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { Tokenpayload } from '@/application/dto/token-payload.interface';
import { UserDocument } from '@/domain/entity/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: Tokenpayload = {
      userId: user._id.toString(),
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      expires: expires,
      httpOnly: true,
    });
  }
}
