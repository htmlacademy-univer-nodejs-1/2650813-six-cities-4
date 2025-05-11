import {CreateLoginUserMessage} from './login-user-messages.js';
import {IsEmail, IsString} from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: CreateLoginUserMessage.email.invalidFormat })
  public email!: string;

  @IsString({ message: CreateLoginUserMessage.password.invalidFormat })
  public password!: string;
}
