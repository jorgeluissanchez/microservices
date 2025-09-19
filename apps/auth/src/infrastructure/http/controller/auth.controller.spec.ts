import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../infrastructure/http/controller/auth.controller';
import { AuthService } from '../../../application/service/auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });
});
