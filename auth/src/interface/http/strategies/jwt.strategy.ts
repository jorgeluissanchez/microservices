import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '@/application/service/users.service';
import { ConfigService } from '@nestjs/config';
import { Tokenpayload } from '@/application/dto/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers?.Authentication,
      ]),
      secretOrKey: jwtSecret,
    });
  }

  async validate({ userId, role }: Tokenpayload): Promise<any> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      return null;
    }
    // Return the plain object with the role from the token
    return { ...user.toObject(), role };
  }
}
