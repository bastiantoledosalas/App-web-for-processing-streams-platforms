import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  redirect?: string;

  @IsString()
  @IsOptional()
  csrfToken?: string;

  @IsString()
  @IsOptional()
  callbackUrl?: string;
}
