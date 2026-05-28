import type { RoleType } from '../dto/account';

export const isAdmin = (roles?: RoleType[]): boolean =>
  roles?.some(r => r.name === 'admin') ?? false;
