import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsEnum, } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superuser = 'superuser',
}

export class CreateUserDto {

  @ApiProperty({ description: 'First name of the user', example: 'John'})
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Doe'})
  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com'})
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Password for the user account (minimum length: 6)', example: '123456'})
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'Role of the user. Optional field.', enum: ValidRoles, example: ValidRoles.user, required: false})
  @IsString()
  @IsOptional()
  @IsEnum( ValidRoles)
  readonly role?: ValidRoles;
}


