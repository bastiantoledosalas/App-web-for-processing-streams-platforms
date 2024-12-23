import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')  {
  canActivate(context) {
    // Llama al método canActivate del guard base (AuthGuard)
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // Si no se encontró usuario o ocurrió un error, lanza una excepción
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token or user not found');
    }

    const request = context.switchToHttp().getRequest();
    const userIdFromParam = request.params.id;

    if (user.role === 'user' && user._id !== userIdFromParam) {
      throw new ForbiddenException('You do not have permission to modify resources');
    }
    
    // Si todo está bien, devuelve el usuario (que tiene el id del JWT en su payload)
    return user;
  }
}