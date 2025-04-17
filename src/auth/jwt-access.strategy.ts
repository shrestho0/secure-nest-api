
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET as string,

        });
    }

    async validate(payload: any) {
        if (payload.tokenType != 'access') {
            throw new UnauthorizedException('Must be an access token');
        }
        return { id: payload.sub, username: payload.username, role: payload.role, email: payload.email };
    }
}
