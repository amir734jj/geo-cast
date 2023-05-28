import { UserAccount } from '../../../lib/dtos/account/user.account.ts';
import { axios } from '../utilities';

export const getProfile = () => axios.get<UserAccount>('/profile');

export const updateProfile = (profile: UserAccount) => axios.post<UserAccount>('/profile', profile);
