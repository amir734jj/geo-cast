import { ProfileType } from './profile.account';
import { RoleType } from './role.account';
import {EntityType} from "./entity.dal";

export type UserType = {
  email: string;
  name: string;
  roles: RoleType[];
  active: boolean;
  createdAt?: string | Date;
  lastLoginAt?: string | Date | null;
} & ProfileType & EntityType;
