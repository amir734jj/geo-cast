import { Controller, Get, Param, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type User from '../models/users.model';
import { AbstractController } from '../abstracts/abstract.controller';
import UsersService from '../services/users.service';
import type IBasicCrud from '../interfaces/crud.interface';
import JwtAuthGuard from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/role.enum';

@ApiTags('user')
@Controller('user')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export default class UserController extends AbstractController<User> {
  constructor (private readonly usersService: UsersService) {
    super();
  }

  service: IBasicCrud<User> = this.usersService;

  @Get()
  @SerializeOptions({ groups: ['admin'] })
  override async getAll (): Promise<User[]> {
    return super.getAll();
  }

  @Get(':id')
  @SerializeOptions({ groups: ['admin'] })
  override async get (@Param('id') id: number): Promise<User> {
    return super.get(id);
  }
}
