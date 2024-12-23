import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersService {
    private readonly httpService;
    private readonly baseUrl;
    constructor(httpService: HttpService);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<any>;
    remove(id: string): Promise<void>;
}
