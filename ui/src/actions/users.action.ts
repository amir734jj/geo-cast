import { UserType } from '@geo-cast/lib/dto/account';
import {axios} from '../utilities';

export const getUsers = () => axios.get<UserType[]>('/user');

