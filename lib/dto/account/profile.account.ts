import { RoleType } from "./role.account";

export type ProfileType = {
    name: string;
    description: string;
};

export type ExtendedProfileType = ProfileType & {
  email: string;
  roles: RoleType[];
  created_at?: string | Date;
  last_login_at?: string | Date | null;
};
