import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ExtractJwt } from "passport-jwt";
import { JwtRefreshAuthGuard } from "./jwt-refresh.guard";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user";
import { LocalAuthGuard } from "./local-auth.guard";
import { plainToInstance } from "class-transformer";
import { LoginUserResponseDto } from "./dto/login-user";
import { UserDto } from "../user/dto/user-dto";
import { JwtAccessAuthGuard } from "./jwt-access.guard";
import { Roles } from "./roles.decorator";
import { Role } from "@prisma/client";
import { RolesGuard } from "./roles.guard";



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * Register a new user
   * @param registerUserDto 
   * @returns RegisterUserResponseDto
   */
  @Post("/register")
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }

  /**
   * Login user
   * @param req 
   * @returns LoginUserResponseDto
   */
  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async login(@Req() req) {
    const user = req.user;
    const tokens = await this.authService.generateTokens(user);
    return plainToInstance(LoginUserResponseDto, {
      // user: userDto,
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      }, message: "Login successful",
    },)

  }


  /**
   * Refresh user
   * @param req 
   * @returns 
   */
  @UseGuards(JwtRefreshAuthGuard)
  @Post("/refresh")
  async refresh(@Req() req) {
    const user = req.user;
    // check if user exists
    // blacklist the old token
    const oldToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;
    await this.authService.blacklistToken(oldToken);
    // generate new tokens

    const tokens = await this.authService.generateTokens(user);
    return plainToInstance(LoginUserResponseDto, {
      tokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
      message: "Token refreshed successfully",

    })

  }



  /**
   * Get user info
   * @param req 
   * @returns 
   */
  @UseGuards(JwtAccessAuthGuard, RolesGuard)
  // @Roles(Role.USER)
  @Get("/me")
  async getMe(@Req() req) {
    const user = req.user;
    const userActual = await this.authService.validateUserEmail(user.email);
    return plainToInstance(UserDto, userActual);
  }



}
