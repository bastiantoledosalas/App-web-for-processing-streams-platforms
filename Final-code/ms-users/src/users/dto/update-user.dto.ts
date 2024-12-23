import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly lastname?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;
}
