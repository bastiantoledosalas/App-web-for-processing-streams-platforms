import { Controller, Get, Post, Body, Patch, Param, Delete, Put, BadRequestException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.',schema:{example: { _id: '6765861765f0419cf16a2dc6', name: 'John', lastname: 'Doe' , email: 'john.doe@example.com', password: '123456' } } })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({
    type: CreateUserDto,
    description: 'Details of the user to create.',
    schema: {
      example: {
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: '123456',
      },
    },
  })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`Creating user with data: ${JSON.stringify(createUserDto)}`);
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    schema: {
      example: [
        { _id: '6765861765f0419cf16a2dc6', name: 'John', lastname: 'Doe', email: 'john.doe@example.com', role: 'admin' },
        { _id: '7765861765f0419cf16a2dc7', name: 'Jane', lastname: 'Doe', email: 'jane.doe@example.com', role: 'user' },
      ],
    },
  })
  @Get()
  async findAll() {
    this.logger.log('Retrieving all users');
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Retrieve a user by email' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    schema: {
      example: {
        id: '6765861765f0419cf16a2dc6',
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email format.' })
  @ApiParam({
    name: 'email',
    description: 'Email of the user to retrieve',
    example: 'john.doe@example.com',
  })
  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new BadRequestException('El formato del correo no es valido');
    }
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    schema: {
      example: {
        id: '6765861765f0419cf16a2dc6',
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to retrieve',
    example: '6765861765f0419cf16a2dc6',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Retrieving user with ID: ${id}`);
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    schema: {
      example: {
        id: '6765861765f0419cf16a2dc6',
        name: 'John',
        lastname: 'Smith',
        email: 'john.smith@example.com',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Details of the user to update.',
    schema: {
      example: {
        name: 'John',
        lastname: 'Smith',
        email: 'john.smith@example.com',
      },
    },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({
    type: UpdatePasswordDto,
    description: 'Details for updating the password.',
    schema: {
      example: {
        oldPassword: '123456',
        newPassword: 'abcdef',
      },
    },
  })
  @Put(':id/password')
  updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    this.logger.log(`Updating password for user with ID: ${id}`);
    return this.usersService.updatePassword(id, updatePasswordDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to delete',
    example: '6765861765f0419cf16a2dc6',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}