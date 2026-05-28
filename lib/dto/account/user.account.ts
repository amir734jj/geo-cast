import { ProfileType } from './profile.account';
import { RoleType } from './role.account';
import {EntityType} from "./entity.dal";

export type UserType = {
  email: string;
  name: string;
  roles: RoleType[];
  active: boolean;
  created_at?: string | Date;
  last_login_at?: string | Date | null;
} & ProfileType & EntityType;
