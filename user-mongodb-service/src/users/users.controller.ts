import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() userData: { username: string; email: string; password: string }) {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: Partial<{ userFirstName: string; userLastName: string}>) {
    return this.userService.updateUser(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
