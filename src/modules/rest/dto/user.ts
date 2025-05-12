import { UserType } from './cities.js';
import { IsString, IsEmail, IsOptional, Length, Matches } from 'class-validator';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  type: UserType;
}

export class CreateUserDto {
  id!: string;

  @IsString()
  @Length(1, 15, {message: 'Username must be 1-15 symbols'})
    name!: string;

  @IsEmail({}, {message: 'Please, provide a valid email'})
    email!: string;

  @IsString()
  @Length(6, 12, {message: 'Secret word must be 6-12 symbols'})
    password!: string;

  type!: UserType;

  @IsOptional()
  @Matches(/\.(jpg|jpeg|png)$/, {message: 'Avatar should be .jpg, .jpeg or .png file'})
    avatarUrl?: string;
}

export class LoginUserDto {
  @IsEmail({}, {message: 'Please, provide a valid email'})
    email!: string;

  @IsString()
  @Length(6, 12, {message: 'Secret word must be 6-12 symbols'})
    password!: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}
