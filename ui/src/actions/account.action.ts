import {LoginType, RegisterType, UserType} from '@geo-cast/lib/dtos/account';
import {axios} from '../utilities';

export const login = (user: LoginType) => axios.post<string>('/account/login', user);

export const register = (user: RegisterType) => axios.post<UserType>('/account/register', user);

export const logout = () => axios.post('/account/logout', {});

export const accountInfo = () => axios.get<UserType>('/account');

export const refreshToken = () => axios.get<string>('/account/refresh');
