import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';  // Deberías importar la estrategia desde passport-jwt
import { ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service'; // Si tienes un servicio que maneja la autenticación
import { JwtPayload } from '../interfaces/jwt-payload.interface';  // Asegúrate de definir esta interfaz
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,   // Usamos el servicio de auth para validar el usuario
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extrae el JWT del encabezado Authorization
      secretOrKey: configService.get<string>('JWT_SECRET'),       // Obtiene la clave secreta
    });
  }

  async validate(payload: JwtPayload) {
    // Aquí buscamos al usuario por su id extraído del payload del JWT
    const user = await this.authService.findUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user; // Si el usuario existe, lo retornamos
  }
}
