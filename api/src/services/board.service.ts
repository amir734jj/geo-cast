import Post from '../models/post.model';
import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import PostService from './posts.service';
import { nanoid } from 'nanoid';
import CreatePostDto from 'src/dto/create.post.dto';
import User from 'src/models/users.model';
import { DateTime } from 'luxon';
import { Readable } from 'stream';
import { AbstractBlobProvider } from 'src/abstracts/abstract.file.provider';

@Injectable()
export default class BoardService {

  constructor(
    private readonly postService: PostService,
    private readonly blobServiceClient: AbstractBlobProvider
  ) {
  }

  async query(): Promise<Post[]> {
    return this.postService.all(10)
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
    this.blobServiceClient.upload(recordingId, file.stream);

    return await this.postService.save({
      user,
      recordingId,
      created_at: DateTime.now().toJSDate(),
      ...post,
    });
  }

  async downloadRecording(recordingId: string): Promise<Readable> {
    return this.blobServiceClient.download(recordingId);
  }

}
