
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsEnum
  } from 'class-validator';
  
  export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    userFirstName: string;
  
    @IsString()
    @IsNotEmpty()
    userLastName: string;

    @IsEmail()
    @IsNotEmpty()
    userEmail: string;

    @IsNotEmpty()
    @IsEnum({
        ADMIN: 'admin',
        USER: 'user',
      })
    role: string;
  }
