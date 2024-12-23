import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from '../../../auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const validRole: string = this.reflector.get(META_ROLES, context.getHandler());
    if (!validRole) return true;  // Si no hay rol definido, dejamos pasar la solicitud

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userIdFromParam = req.params.id;

    if (user.role === 'admin') {
      // Si el usuario es admin, tiene acceso a cualquier endpoint
      return true;
    }

    if (user.role === 'user' && user._id === userIdFromParam) {
      // Si el usuario es 'user' y el parámetro de la solicitud coincide con su id
      return true;
    }

    throw new ForbiddenException(`User with role ${user.role} not allowed to access this resource`);
  }
}
