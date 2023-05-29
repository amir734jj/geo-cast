import { LoginType, ProfileType, RegisterType, UserType } from '@geo-cast/lib/dto/account';
import { axios } from '../utilities';

export const login = (user: LoginType) => axios.post<string>('/account/login', user);

export const register = (user: RegisterType) => axios.post<UserType>('/account/register', user);

export const logout = () => axios.post('/account/logout', {});

export const accountInfo = () => axios.get<UserType>('/account/profile');

export const refreshToken = () => axios.post<string>('/account/refresh', {});

export const updateProfile = (profile: ProfileType) => axios.post<UserType>('/account/profile', profile);
