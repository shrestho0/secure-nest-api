import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { LocalStrategy } from './local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '10m' }
        })
      ], // import to use inside the module
      controllers: [AuthController],
      providers: [AuthService, LocalStrategy, JwtAccessStrategy, JwtRefreshStrategy, PrismaService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', () => {
    expect(controller.register).toBeDefined();
    const registerUserDto = {

    }
  });

});
