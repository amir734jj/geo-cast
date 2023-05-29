import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import LoginUserDto from './login.user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterType } from "@geo-cast/lib/dto/account";

export default class CreateUserDto extends LoginUserDto implements RegisterType {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;
}
