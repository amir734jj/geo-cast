import { ProfileType } from './profile.account';
import { RoleType } from './role.account';

export type UserType = {
  email: string;
  name: string;
  roles: RoleType[];
  location: string;
} & ProfileType;
