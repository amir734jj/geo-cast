import { CreatePostType, PostInfoType } from '@geo-cast/lib/dto/board';
import { axios } from '../utilities';

export const createPost = (user: CreatePostType & { file: File }) => axios.postForm<PostInfoType>('/board/recording', user);

export const downloadBlob = (blobUrl: string, filename: string) => axios.get(blobUrl, { responseType: 'blob' }).then(response => {
  return new File([response.data], filename);
});