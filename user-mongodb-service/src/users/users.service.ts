import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class UsersService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  // Método para crear un usuario (o cualquier otra lógica)
  async createUser(userData: any) {
    // Aquí puedes agregar la lógica para crear el usuario en MongoDB, etc.
    
    console.log('Usuario creado', userData);

    // Publica un mensaje en la cola de RabbitMQ
    const message = JSON.stringify(userData);
    await this.rabbitMQService.publish('user_created_queue', message); // Publicar mensaje
  }

  async findAll(userData: any)  {

    console.log('Usuario encontrado', userData);
    const message = JSON.stringify(userData);
    await this.rabbitMQService.publish('user_find_queue', message); // Publicar mensaje
  }
}
