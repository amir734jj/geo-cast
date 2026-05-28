import type Post from '../models/post.model';
import { Injectable } from '@nestjs/common';
import PostService from './posts.service';
import { nanoid } from 'nanoid';
import type CreatePostDto from 'src/dto/create.post.dto';
import type User from 'src/models/users.model';
import { DateTime } from 'luxon';
import { AbstractBlobProvider, type FileInfo } from 'src/abstracts/abstract.file.provider';
import { type Coordinate } from '@geo-cast/lib/dto/board/common';

@Injectable()
export default class BoardService {
  constructor (
    private readonly postService: PostService,
    private readonly blobServiceClient: AbstractBlobProvider
  ) {
  }

  async query (count: number, page: number, coordinate: Coordinate): Promise<Post[]> {
    return await this.postService.query(count, page, coordinate);
  }

  async like (user: User, postId: number): Promise<Post> {
    const post = await this.postService.get(postId);
    return await this.postService.save({
      ...post,
      likedBy: post?.likedBy.concat([user])
    });
  }

  async unlike (user: User, postId: number): Promise<Post> {
    const post = await this.postService.get(postId);
    return await this.postService.save({
      ...post,
      likedBy: post?.likedBy.filter(u => u.id !== user.id)
    });
  }

  async createPost (user: User, post: CreatePostDto, file: Express.Multer.File): Promise<Post> {
    const recordingId = nanoid();
    await this.blobServiceClient.upload(recordingId, file.buffer, file.originalname);

    return await this.postService.save({
      user,
      recordingId,
      created_at: DateTime.now().toJSDate(),
      ...post
    });
  }

  async getUserPosts (userId: number): Promise<Post[]> {
    return await this.postService.queryByUser(userId);
  }

  async downloadRecording (recordingId: string): Promise<FileInfo> {
    return await this.blobServiceClient.download(recordingId);
  }

  async getCoordinates (): Promise<{latitude: number; longitude: number}[]> {
    return await this.postService.getCoordinates();
  }

  async isPostOwner (userId: number, postId: number): Promise<boolean> {
    const post = await this.postService.get(postId);
    return post?.user?.id === userId;
  }

  async deletePost (postId: number): Promise<void> {
    const post = await this.postService.get(postId);
    if (post) {
      await this.postService.delete(postId);
      try {
        await this.blobServiceClient.delete(post.recordingId);
      } catch {
        // blob may already be gone
      }
    }
  }
}
