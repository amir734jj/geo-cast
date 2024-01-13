import { RoleType } from "./role.account";

export type ProfileType = {
    name: string;
    description: string;
};

export type ExtendedProfileType = ProfileType & {
  email: string;
  roles: RoleType[]
};
