import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USER_QUEUE') private readonly userClient: ClientProxy,
  ) {}

  @Post()
  async createUser(@Body() userData: any): Promise<string> {
    try {
      // Publicar mensaje en RabbitMQ
      this.userClient.emit('create_user', userData);
      return 'User creation request sent successfully!';
    } catch (error) {
      throw new Error(`Failed to publish user message: ${error.message}`);
    }
  }
}
