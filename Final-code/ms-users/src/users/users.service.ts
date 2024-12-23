import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const {email, password } = createUserDto;

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await this.userModel.findOne({email});
      
      if (existingUser) {
        throw new BadRequestException(`El correo electrónico ${email} ya está registrado.`);
      }
    
      // Crear y guardar el nuevo usuario
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      const user = savedUser.toObject();      // Convertir el documento a un objeto JS
      delete user.password;                   // Eliminar la contraseña del objeto de usuario
      return user;                            // Devolver el objeto de usuario sin la contraseña
    } catch (error){
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('name lastname email role createdAt updatedAt').exec()
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }
      return user;
    }catch (error){
      if (error.kind === 'ObjectId') {
        // Si el ID es invalido, podemos lanzar un error especifico
        throw new NotFoundException(`User #${id} not found`);
      }
      throw new InternalServerErrorException('Error al obtener el usuario');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('+password')
        .exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
    return user;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el usuario por correo electronico');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new NotFoundException(`User #${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Invalid user data');
      }
      throw new InternalServerErrorException('Error updating the user');
    }
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<User> {
    
    try {
      const user = await this.userModel.findById(id).select('+password').exec();

      if (!user) {
        throw new NotFoundException(`User #${id} not found`);
      }

      const { currentPassword, newPassword } = updatePasswordDto;

      // Comparar la contraseña actual con la almacenada
      const isPasswordMatching = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatching) {
        throw new BadRequestException('Current password is incorrect');
      } else if (newPassword.length < 8) {
        throw new BadRequestException('New password must be at least 8 characters long');
      }

      // Hashear la nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;

      // Guardar el usuario con la nueva contraseña
      const savedUser = await user.save();
      const newUser = savedUser.toObject();   // Convertir el documento a un objeto JS
      delete newUser.password;                // Eliminar la contraseña del objeto de usuario
      return newUser;                         // Devolver el objeto de usuario sin la contraseña
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating the password');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      
      // Eliminar el usuario por id
      const result = await this.userModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException(`User #${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error deleting the user');
    }
  }
}
