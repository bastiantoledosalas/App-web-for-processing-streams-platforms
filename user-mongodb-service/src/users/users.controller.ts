import { Controller, Post, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: { name: string; email: string}) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll(@Body() createUserDto:{ name:string; email: string; password: string}) {
    return this.usersService.findAll(createUserDto);
  }
}
