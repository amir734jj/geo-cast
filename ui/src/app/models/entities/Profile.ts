import { Role } from '../enums/RoleEnum';

export interface Profile {
  name: string
  email: string
  role: Role
  phoneNumber: string
  description: string
  photo: string
}
