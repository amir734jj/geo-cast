import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@geo-cast/lib/dto/account';

export default class LoginUserDto implements LoginType {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public password: string;
}
