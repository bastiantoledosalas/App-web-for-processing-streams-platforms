import { Module} from '@nestjs/common';
import { ProcessingService } from './processing.service';
import { HttpClientModule } from 'src/httpclient/http-client.module';
import { ValidationService } from './validate.service';

@Module({
  imports     : [ HttpClientModule,     // HttpClientModule para hacer peticiones HTTP   
                ],  
  providers   : [ProcessingService, ValidationService],                // Proveedor del ProcessingService
  exports     : [ProcessingService],
})
export class ProcessingModule{}