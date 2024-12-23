import { BadRequestException, Injectable, InternalServerErrorException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { HttpService } from '@nestjs/axios';
import { SignupDto } from './dto/signup.dto';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  private readonly baseUrl: string;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService  : ConfigService,

  ) {
    this.baseUrl = this.configService.get<string>('USERS_SERVICE_URL')
  }

  async register(signupDto: SignupDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/users`, {
          ...signupDto,
          role: 'user',
        }),
      );
      const user = response.data;
      return this.login(user);
    } catch (error) {
      console.log({ error });
      throw new BadRequestException('Error creating user');
    }
  }

  async findUserById(id: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/users/${id}`),
      );
      return response.data;
    } catch (error) {
      console.log({ error });
    }
  }

  async login(signinDto: SigninDto) {
    const { email, password } = signinDto;

    try {
      const response = await lastValueFrom(this.httpService.get(`${process.env.USERS_SERVICE_URL}/users/by-email/${email}`));
      const userFound = response.data;

      if (!userFound) {
        throw new BadRequestException('User not found');
      }

      if (!bcrypt.compareSync(password, userFound.password)) {
        throw new BadRequestException('Invalid password');
      }

      const payload = {
        name: userFound.name,
        email: userFound.email,
        role: userFound.role,
      };
      const token = this.getJwtToken({ id: userFound._id });
      this.logger.log('Payload y token:', { ...payload, token });

      return { ...payload, token: this.getJwtToken({ id: userFound._id }) };
    } catch (error) {
      console.log({ error });
      if (error.response && error.response.status){
        if (error.response.status ===404){
          throw new BadRequestException('User not found');
        }
        if (error.response.status === 400) {
          throw new BadRequestException('Invalid request');
        }
      }
      throw new ServiceUnavailableException('User service is unavailable, please try again later');
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
