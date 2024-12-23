import { JwtService } from '@nestjs/jwt';
import { SigninDto } from './dto/signin.dto';
import { HttpService } from '@nestjs/axios';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly httpService;
    constructor(jwtService: JwtService, httpService: HttpService);
    private readonly baseUrl;
    register(signupDto: SignupDto): Promise<{
        token: string;
        name: any;
        email: any;
        role: any;
    }>;
    findUserById(id: string): Promise<any>;
    login(signinDto: SigninDto): Promise<{
        token: string;
        name: any;
        email: any;
        role: any;
    }>;
    private getJwtToken;
}
