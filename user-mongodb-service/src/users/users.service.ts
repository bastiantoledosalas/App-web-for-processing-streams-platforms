import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service'; // Servicio RabbitMQ

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async createUser(userData: { username: string; email: string; password: string }) {
    const newUser = new this.userModel(userData);
    await newUser.save();
    // Enviar mensaje a RabbitMQ para notificar que el usuario fue creado
    await this.rabbitMQService.publish('user.created', JSON.stringify(newUser));
    return newUser;
  }

  async getUser(id: string) {
    return await this.userModel.findById(id);
  }

  async updateUser(id: string, userData: Partial<User>) {
    return await this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteUser(id: string) {
    await this.userModel.findByIdAndDelete(id);
    // Enviar mensaje a RabbitMQ para notificar que el usuario fue eliminado
    await this.rabbitMQService.publish('user.deleted', JSON.stringify({ id }));
  }
}
