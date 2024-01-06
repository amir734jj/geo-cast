export type ProfileType = {
    name: string;
    description: string;
};

export type ExtendedProfileType = ProfileType & {
  email: string;
};
