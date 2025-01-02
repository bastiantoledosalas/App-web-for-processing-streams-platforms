import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {

  @ApiProperty({ description: 'The name of the user. This field is optional.', example: 'John', required: false })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ description: 'The lastname of the user. This field is optional.', example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  readonly lastname?: string;

  @ApiProperty({ description: 'The email address of the user. This field is optional.', example: 'john.doe@example.com', required: false })
  @IsEmail()
  @IsOptional()
  readonly email?: string;
}
