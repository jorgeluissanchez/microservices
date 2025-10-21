import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/application/service/auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(3600) },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mockToken') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debería generar una cookie JWT válida', async () => {
    const mockUser = { _id: { toString: () => 'user123' } };
    const response = { cookie: jest.fn() } as unknown as Response;

    await service.login(mockUser as any, response);

    expect(jwtService.sign).toHaveBeenCalledWith({ userId: 'user123' });
    expect(response.cookie).toHaveBeenCalledWith(
      'Authentication',
      'mockToken',
      expect.objectContaining({ httpOnly: true }),
    );
  });
});
