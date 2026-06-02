import { EntityType, UserType } from '@geo-cast/lib/dto/account';
import {axios} from '../utilities';

export const getUsers = () => axios.get<(UserType & EntityType)[]>('/user');

export const setUserActive = (user: EntityType, active: boolean) => axios.patch<UserType>(`/user/${user.id}`, { active });

export const deleteUser = (user: EntityType) => axios.delete(`/manage/account/${user.id}`);
