
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly authService: AuthService, // Inject the AuthService to use its methods       
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET as string,
            passReqToCallback: true, // to access the request object 
        });


    }

    async validate(req: Request, payload: any) {
        if (payload.tokenType != 'refresh') {
            throw new UnauthorizedException('Must be a refresh token');
        }


        const isTokenBlacklisted = await this.authService.isTokenBlacklisted(ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string);
        if (isTokenBlacklisted) {
            throw new UnauthorizedException('Token is blacklisted. Please login again');
        }

        // check if user exists
        const user = await this.authService.validateUserEmail(payload.email);
        // if yes, return user
        if (!user) {
            // if no, throw unauthorized exception
            throw new UnauthorizedException('User not found');
        }

        return user;


        // return { userId: payload.sub, username: payload.username, role: payload.role, email: payload.email };
    }
}

