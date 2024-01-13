export type ProfileType = {
    name: string;
    description: string;
};

export type RoleType = {
  name: string;
}

export type ExtendedProfileType = ProfileType & {
  email: string;
  roles: RoleType[]
};
