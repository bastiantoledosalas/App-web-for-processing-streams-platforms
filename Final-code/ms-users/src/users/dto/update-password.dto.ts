import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly currentPassword: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly newPassword: string;
}
