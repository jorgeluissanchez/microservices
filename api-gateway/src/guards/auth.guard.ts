import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Skip authentication for public endpoints
    const url = request.url.split('?')[0];
    const method = request.method;
    
    if ((method === 'POST' && url === '/users') || 
        (method === 'POST' && url === '/auth/login')) {
      return true;
    }

    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      console.log('API Gateway: JWT Secret configured:', jwtSecret ? 'Yes' : 'No');
      console.log('API Gateway: Token to verify:', token.substring(0, 20) + '...');
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
      });

      console.log('API Gateway: Token verified successfully, payload:', payload);
      // Attach user info to request
      (request as any).user = payload;
      return true;
    } catch (error) {
      console.error('API Gateway: JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // Try to get token from cookies first
    const tokenFromCookie = request.cookies?.Authentication;
    if (tokenFromCookie) {
      console.log('API Gateway: Token found in cookie:', tokenFromCookie.substring(0, 20) + '...');
      return tokenFromCookie;
    }

    // Try to get token from Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('API Gateway: Token found in Authorization header');
      return authHeader.substring(7);
    }

    console.log('API Gateway: No token found in request');
    return undefined;
  }
}
