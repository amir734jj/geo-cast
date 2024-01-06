import { IsString, IsNotEmpty } from 'class-validator'
import LoginUserDto from './login.user.dto'
import { ApiProperty } from '@nestjs/swagger'
import { type RegisterType } from '@geo-cast/lib/dto/account'

export default class CreateUserDto extends LoginUserDto implements RegisterType {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string
}
