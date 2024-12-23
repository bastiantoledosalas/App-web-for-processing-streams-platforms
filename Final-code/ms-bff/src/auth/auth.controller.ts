import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    this.logger.log('Ha llegado la solicitud desde el Frontend al Backend con este Body:', SigninDto);
    return this.authService.login(signinDto);
  }

  @Post('register')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.register(signupDto);
  }
}