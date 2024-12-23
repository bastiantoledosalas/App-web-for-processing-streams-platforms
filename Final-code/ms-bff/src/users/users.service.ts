import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly httpService    : HttpService,
    private readonly configService  : ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('USERS_SERVICE_URL');
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/users`, createUserDto),
      );
      return response.data;  
    } catch (error) {
      this.logger.log('Error creating user:', error);
      throw new BadRequestException('Error creating user');
    }
    
  }

  async findAll() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/users`),
      );
      return response.data;  
    } catch (error) {
      this.logger.log('Error fetching users:', error);
      throw new BadRequestException('Error fetching users');
    }
    
  }

  async findOne(id: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/users/${id}`),
      );
      return response.data;      
    } catch (error) {
      this.logger.log('Error fetching user', error);
      if (error.response.status === 404){
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Error fetching user');
    }

  }

  async findByEmail(email: string){
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/users/by-email/${email}`),
      );
      return response.data;
    }catch (error){
      this.logger.log('Error fetching user', error);
      if (error.response.status === 404){
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Error fetching user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.patch(`${this.baseUrl}/users/${id}`, updateUserDto),
      );
      return response.data;  
    } catch (error) {
      this.logger.log('Error updating user:', error);
      throw new BadRequestException('Error updating user');
    }
    
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    
    try {
      const response = await lastValueFrom(this.httpService.put(`${this.baseUrl}/users/${id}/password`, updatePasswordDto));
      return response.data;
    } catch (error) {
      this.logger.log('Error updating password:',error);
      if (error.response.status === 404) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Error updating password');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await lastValueFrom(
        this.httpService.delete(`${this.baseUrl}/users/${id}`),
      );
    } catch (error) {
      this.logger.log('Error deleting user:',error);
      if (error.response.status === 404) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Error deleting user');
    }
  }
}
