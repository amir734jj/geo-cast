import {CreatePostType, PostInfoType} from '@geo-cast/lib/dto/board/post';
import {axios} from '../utilities';
import {Coordinate} from "@geo-cast/lib/dto/board/common";

export const createPost = (post: CreatePostType & {
  file: File
}) => axios.postForm<PostInfoType>('/board/recording', post);

export const downloadBlob = async (blobUrl: string) =>  await fetch(blobUrl).then(r => r.blob());

export const queryPosts = (count: number, page: number, coordinate?: Coordinate) => axios.get<PostInfoType[]>('/board/query', {
  params: {
    count,
    page,
    ...coordinate
  }
});
