import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint para crear un usuario
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Endpoint para obtener todos los usuarios
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Endpoint para obtener un usuario por su correo electronico
  @Get('by-email/:email')
  findByEmail(@Param('email') email: string) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new BadRequestException('El formato del correo no es valido');
    }
    return this.usersService.findByEmail(email);
  }

  // Endpoint para recuperar un usuario por su id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Endpoint para actualizar datos de un usuario
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Endpoint para actualizar la contraseña de un usuario
  @Put(':id/password')
  updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  // Endpoint para eliminar un usuario
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}