import {IsString, IsNotEmpty, IsEmail} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { type LoginType } from '@geo-cast/lib/dto/account';

export default class LoginUserDto implements LoginType {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;
}
