import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import LoginUserDto from '../../dto/login.user.dto';
import CreateUserDto from '../../dto/create.user.dto';
import AuthService from '../../services/auth.service';
import JwtAuthGuard from '../../guards/jwt-auth.guard';
import type User from '../../models/users.model';
import ProfileDto from 'src/dto/profile.user.dto';

@ApiTags('account')
@Controller('account')
@ApiBearerAuth()
export default class AccountController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    description: 'Successfully logged out',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async login(@Body() login: LoginUserDto): Promise<string> {
    const response = await this.authService.login(login);

    if (!response) {
      throw new BadRequestException('Login failed');
    } else {
      return response;
    }
  }

  @Post('register')
  @ApiOkResponse({
    description: 'Successfully registered',
  })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  async register(@Body() register: CreateUserDto): Promise<User> {
    const response = await this.authService.register(register);

    if (!response) {
      throw new BadRequestException('Register failed');
    } else {
      return response;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOkResponse({
    description: 'Successfully logged out',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async logout(@Request() req): Promise<User | null> {
    return await this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiOkResponse({
    description: 'Successfully updated user profile',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({
    description: 'Failed to update profile',
  })
  async updateProfile(
    @Request() req,
    @Body() profile: ProfileDto
  ): Promise<User | null> {
    return await this.authService.updateProfile(req.user, profile);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiOkResponse({
    description: 'Successfully generated a new JWT token',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiBadRequestResponse({
    description: 'Failed to generate new JWT token',
  })
  async refreshToken(@Request() req): Promise<string> {
    return await this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOkResponse({
    description: 'Successfully returned the user profile',
  })
  @ApiForbiddenResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden.',
  })
  async getProfile(@Request() req): Promise<User> {
    return req.user;
  }
}
