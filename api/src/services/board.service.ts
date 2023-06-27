import Post from '../models/post.model';
import { Injectable } from '@nestjs/common';
import PostService from './posts.service';
import { nanoid } from 'nanoid';
import CreatePostDto from 'src/dto/create.post.dto';
import User from 'src/models/users.model';
import { DateTime } from 'luxon';
import { AbstractBlobProvider, FileInfo } from 'src/abstracts/abstract.file.provider';
import { Coordinate } from '@geo-cast/lib/dto/board/common'

@Injectable()
export default class BoardService {

  constructor(
    private readonly postService: PostService,
    private readonly blobServiceClient: AbstractBlobProvider
  ) {
  }

  async query(count: number, page: number, coordinate: Coordinate): Promise<Post[]> {
    return this.postService.query(count, page, coordinate);
  }

  async like(user: User, postId: number): Promise<Post> {
    const post = await this.postService.get(postId);
    return await this.postService.save({
      ...post,
      likedBy: post.likedBy.filter(u => u.id !== user.id)
    });
  }

  async unlike(user: User, postId: number): Promise<Post> {
    const post = await this.postService.get(postId);
    return await this.postService.save({
      ...post,
      likedBy: post.likedBy.concat([user])
    });
  }

  async createPost(user: User, post: CreatePostDto, file: Express.Multer.File): Promise<Post> {

    const recordingId = nanoid();
    await this.blobServiceClient.upload(recordingId, file.buffer, file.originalname);

    return await this.postService.save({
      user,
      recordingId,
      created_at: DateTime.now().toJSDate(),
      ...post,
    });
  }

  async downloadRecording(recordingId: string): Promise<FileInfo> {
    return this.blobServiceClient.download(recordingId);
  }
}
