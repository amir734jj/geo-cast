import { RoleType } from "./role.account";

export type ProfileType = {
    name: string;
    description: string;
};

export type ExtendedProfileType = ProfileType & {
  roles: RoleType[];
  active: boolean;
  createdAt?: string | Date;
};
