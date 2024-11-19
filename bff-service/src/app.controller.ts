import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-user')
  async createUser(@Body() userData: any) {
    // Llama al servicio para enviar un mensaje a RabbitMQ
    return this.appService.sendUserCreationMessage(userData);
  }
}