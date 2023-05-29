import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileType } from "@geo-cast/lib/dto/account";

export default class ProfileDto implements ProfileType {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;
}
