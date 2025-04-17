import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator'; // Import the correct key
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const allowedRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
        if (!allowedRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role || !matchRoles(allowedRoles, user.role)) {
            throw new ForbiddenException('You are not allowed to access this page.');
        }

        return true;
    }
}

function matchRoles(allowedRoles: Role[], userRoles: Role[]): boolean {
    return allowedRoles.some(role => userRoles.includes(role));
}
