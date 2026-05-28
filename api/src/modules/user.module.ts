import { Module } from '@nestjs/common';
import UserController from '../controllers/user.controller';
import UsersService from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../models/users.model';
import Token from '../models/token.model';
import TokenService from '../services/token.service';
import RoleService from '../services/role.service';
import Role from '../models/roles.model';
import ProfileController from '../controllers/profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token, Role])],
  controllers: [UserController, ProfileController],
  providers: [UsersService, TokenService, RoleService],
  exports: [UsersService, TokenService, RoleService]
})
export default class UserModule {}
