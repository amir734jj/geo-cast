import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type User from '../models/users.model'
import UsersService from '../services/users.service'
import JwtAuthGuard from '../guards/jwt-auth.guard'
import RecordingPost from '../models/post.model'

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export default class ProfileController {
  constructor (private readonly usersService: UsersService) {
  }

  @Get(':userId')
  @ApiOkResponse({
    description: 'Successfully queries user public profile',
    type: RecordingPost
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async getUserPublicProfile (@Param('userId') userId: number): Promise<User | null> {
    return await this.usersService.get(userId)
  }
}
