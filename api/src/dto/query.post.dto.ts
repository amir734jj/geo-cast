import { IsNumber, IsLongitude, IsLatitude, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export default class QueryPostDto {
  @ApiProperty()
  @IsNumber()
  @IsLongitude()
    longitude: number

  @ApiProperty()
  @IsNumber()
  @IsLatitude()
    latitude: number

  @ApiProperty()
  @IsNumber()
  @Min(1)
    count: number

  @ApiProperty()
  @IsNumber()
  @Min(1)
    page: number
}
