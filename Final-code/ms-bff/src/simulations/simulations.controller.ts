import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { StartSimulationDto } from './dto/start-simulation.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@Controller('simulations')

export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  // Crear Simulación
  @Post()
  @Auth(ValidRoles.admin,ValidRoles.user)
  create(
    @Body() createSimulationDto: CreateSimulationDto,
    @GetUser() user: any,
  ) {
    return this.simulationsService.create(createSimulationDto, user.email);
  }

  // Obtener todas las simulaciones
  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.simulationsService.findAll();
  }

  // Obtener una simulación por su ID
  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  async findOne(@Param('id') id: string, @GetUser() user:any) {

    const simulation = await this.simulationsService.findOne(id);
    if (!simulation){
      throw new ForbiddenException('Simulation not found');
    }

    if (user.role === 'admin'){
      return simulation;

    }
    // Si el usuario es 'user', solo podrá acceder a la simulación que le pertenece
    if(simulation.user !== user.email){
      throw new ForbiddenException('You do not have permission to access this simulation');
    }
    return simulation;
  }

  // Actualizar una simulación por su ID
  @Put(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  async update(
    @Param('id') id: string,
    @Body() updateSimulationDto: UpdateSimulationDto,
    @GetUser() user: any,
  ) {

    const simulation = await this.simulationsService.update(id, updateSimulationDto);

    if (!simulation){
      throw new NotFoundException('Simulation not found');
    }
    if (user.role === 'admin'){
      return this.simulationsService.update(id,updateSimulationDto);
    }
    if (simulation.user !==user.email){
      throw new ForbiddenException('You do not have permission to modify this simulation');
    }
  // Si es el dueño de la simulación, se puede proceder con la actualización
  return this.simulationsService.update(id, updateSimulationDto);
  }

  // Eliminar una simulación
  @Delete(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  async remove(@Param('id') id: string,
  @GetUser() user: any) {

    const simulation = await this.simulationsService.findOne(id);

    if(!simulation){
      throw new NotFoundException('Simulation not found');
    }
    if (user.role === 'admin'){
      return this.simulationsService.remove(id);
    }
    if (simulation.user !== user.email){
      throw new ForbiddenException('You do not have permission to delete this simulation');
    }

    return this.simulationsService.remove(id)

  }

  // Iniciar una simulación
  @Post(':id/start')
  @Auth(ValidRoles.admin, ValidRoles.user)
  async start(
    @Param('id') id: string,
    @Body() startSimulationDto: StartSimulationDto,
    @GetUser() user: any,
  ) {

    const simulation = await this.simulationsService.findOne(id);

    if ( !simulation){
      throw new NotFoundException('Simulation not found');
    }

    if( user.role === 'admin'){
      return this.simulationsService.start(id,startSimulationDto);
    }

    if( simulation.user !== user.email){
      throw new ForbiddenException('You do not have permision to start this simulation');
    }
    else if(simulation.user === user.email){
      return await this.simulationsService.start(id, startSimulationDto);
    }
  }

  // Obtener simulaciones de un usuario específico
  @Get(':userId')
  @Auth(ValidRoles.admin, ValidRoles.user)
  findByUser(
    @Param('userId') userId: string,
    @GetUser() user:any,
  ) {
    if (user.role === 'admin'){
      return this.simulationsService.findUserSimulations(userId);
    }

    // Si el usuario no es admin, debe poder acceder solo a sus propias simulaciones
    if (user.email !==userId){
      throw new ForbiddenException('You can only access your own simulations');
    }
    return this.simulationsService.findUserSimulations(userId);
  }
}
