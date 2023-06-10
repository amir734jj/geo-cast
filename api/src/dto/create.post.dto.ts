import { IsNumber, IsPositive, IsLongitude, IsLatitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePostType } from "@geo-cast/lib/dto/board";

export type CreatePostDtoType = InstanceType<typeof CreatePostDto>;

export default class CreatePostDto implements CreatePostType {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiProperty()
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  @IsLatitude()
  latitude: number;
}
