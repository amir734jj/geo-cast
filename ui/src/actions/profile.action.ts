import {ExtendedProfileType} from '@geo-cast/lib/dto/account';
import {axios} from '../utilities';

export const getUserPublicProfile = (userId: string) => axios.get<ExtendedProfileType>(`/profile/${userId}`);
