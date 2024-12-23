import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(signinDto: SigninDto): Promise<{
        token: string;
        name: any;
        email: any;
        role: any;
    }>;
    signup(signupDto: SignupDto): Promise<{
        token: string;
        name: any;
        email: any;
        role: any;
    }>;
}
