import { Role } from '../enums/RoleEnum';

export interface User {
  id: string
  name: string
  description: string
  email: string
  phoneNumber: string
  role: Role
  photo: string
};
