import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

// Decorador que extrae el usuario de la solicitud (request)
export const GetUser = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest(); // Obtener el objeto request

  const user = req.user;                  // El usuario debe estar en el request si el JWT Auth Guard lo ha agregado
  
  if (!user) {
    throw new InternalServerErrorException('User not found'); // Si no se encuentra el usuario, lanzar un error
  }
  return user; // Retorna el objeto de usuario
});
