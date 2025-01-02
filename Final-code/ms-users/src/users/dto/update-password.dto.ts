import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {

  @ApiProperty({ description: 'The current password of the user.',example: 'oldPassword123'})
  @IsString()
  @MinLength(6, { message: 'The current password must be at least 6 characters long.' })
  @IsNotEmpty({ message: 'The current password is required.' })
  readonly currentPassword: string;

  @ApiProperty({ description: 'The new password to replace the current one.', example: 'newPassword456'})
  @IsString()
  @MinLength(6, { message: 'The new password must be at least 6 characters long.' })
  @IsNotEmpty({ message: 'The new password is required.' })
  readonly newPassword: string;
}
