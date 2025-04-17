import { Injectable } from '@nestjs/common';
import { RegisterUserDto, RegisterUserResponseDto } from './dto/register-user';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../user/dto/user-dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService, private prismaService: PrismaService) { }

  async register(registerUserDto: RegisterUserDto) {

    // console.log("[DEBUG]: registerUserDto", registerUserDto);

    // hash password
    const hashedPassword = await this.hashPassword(registerUserDto.password);
    // create user from user service
    const { success, user, message } = await this.userService.createUser({
      email: registerUserDto.email,
      passwordHash: hashedPassword,
      name: registerUserDto.name
    });

    const userDto = plainToInstance(UserDto, user);
    const res = plainToInstance(RegisterUserResponseDto, {
      success,
      message,
      user: userDto
    });

    return res;



  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user && await this.verifyPassword(password, user.passwordHash)) {
      return user;
      // const { passwordHash, ...result } = user;
      // return result;
    }
    return null;
  }

  async validateUserEmail(email: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      return user;
    }
    return null;
  }

  async generateTokens(payload: any) {
    payload = { email: payload.email, sub: payload.id, role: payload.role }

    const access_token = await this.jwtService.signAsync({ ...payload, tokenType: 'access' }, { expiresIn: '10m', });
    const refresh_token = await this.jwtService.signAsync({ ...payload, tokenType: 'refresh' }, { expiresIn: '7d', });

    return { access_token, refresh_token }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.prismaService.blacklistedToken.findUnique({
      where: {
        token: token
      }
    });
    if (blacklistedToken) {
      return true;
    }
    return false;
  }
  async blacklistToken(token: string) {
    // console.log("[DEBUG]: blacklisting token", token);
    // blacklist the token
    try {
      await this.prismaService.blacklistedToken.create({ data: { token } })
    } catch (e) {
      // console.log("[DEBUG]: error blacklisting token", e);
    }
  }


  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
