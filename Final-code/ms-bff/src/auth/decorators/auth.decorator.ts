import { applyDecorators, UseGuards } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';
import { RoleProtected } from './role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { JwtAuthGuard } from '../guards/user-role/jwtAuth.guard';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),                // Aplica el decorador RoleProtected con los roles
    UseGuards(JwtAuthGuard, UserRoleGuard), // Usa los guards JwtAuth y UserRole
  );
}
