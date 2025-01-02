import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

// Agrupa los endpoints relacionados con "Health" en la documentación de Swagger
@ApiTags('Health')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  // Describe el propósito de la operación
  @ApiOperation({ summary: 'Health Check Endpoint', description: 'Returns the health status of the application.'})
  @ApiResponse({ status: 200, description: 'The application is healthy.', schema: { example: { status: 'ok'}}})
  @ApiResponse({ status: 500, description: 'Internal server error.'})
  @Get()
  getHealth(): { status: string } {
    this.logger.log('Health endpoint accessed');
    return this.appService.getHealth();
  }
}