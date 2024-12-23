import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';


@Controller('users')

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Crear usuario (Solo accesible para administradores)
  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Obtener todos los usuarios (solo accesible para administradores)
  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.usersService.findAll();
  }

  // Obtener un usuario por ID (solo accesible para administradores o el propio usuario)
  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('by-email/:email')
  @Auth(ValidRoles.admin, ValidRoles.user)
  findByEmail(@Param('email') email: string) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new BadRequestException('El formato del correo no es valido');
    }
    return this.usersService.findByEmail(email);
  }

  // Actualizar usuario (solo accesible para administradores o el propio usuario)
  @Patch(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Actualizar la contraseña (solo accesible para administradores o el propio usuario)
  @Put(':id/password')
  @Auth(ValidRoles.user, ValidRoles.admin)
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  // Eliminar usuario (solo accesible para administradores)
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
