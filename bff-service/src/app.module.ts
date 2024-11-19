import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],                    // Puedes importar otros módulos aquí si es necesario
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}