import type Post from '../models/post.model';
import { Injectable } from '@nestjs/common';
import PostService from './posts.service';
import { nanoid } from 'nanoid';
import type CreatePostDto from 'src/dto/create.post.dto';
import type User from 'src/models/users.model';
import { DateTime } from 'luxon';
import { AbstractBlobProvider, type FileInfo } from 'src/abstracts/abstract.file.provider';
import { type Coordinate } from '@geo-cast/lib/dto/board/common';
import * as worldCountries from '@geo-cast/lib/data/world-countries.json';

@Injectable()
export default class BoardService {
  constructor (
    private readonly postService: PostService,
    private readonly blobServiceClient: AbstractBlobProvider
  ) {
  }

  async query (count: number, page: number, coordinate: Coordinate): Promise<(Post & { country: string })[]> {
    const posts = await this.postService.query(count, page, coordinate);
    return posts.map(p => ({ ...p, country: this.getCountryForCoordinate(p.longitude, p.latitude) }));
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

  async getUserPosts (userId: number): Promise<(Post & { country: string })[]> {
    const posts = await this.postService.queryByUser(userId);
    return posts.map(p => ({ ...p, country: this.getCountryForCoordinate(p.longitude, p.latitude) }));
  }

  async downloadRecording (recordingId: string): Promise<FileInfo> {
    return await this.blobServiceClient.download(recordingId);
  }

  async getStats (): Promise<{country: string; count: number}[]> {
    const coordinates = await this.postService.getCoordinates();
    const countryMap = new Map<string, number>();
    for (const { latitude, longitude } of coordinates) {
      const country = this.getCountryForCoordinate(longitude, latitude);
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    }
    return Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  private getCountryForCoordinate (lng: number, lat: number): string {
    for (const feature of (worldCountries as any).features) {
      const geom = feature.geometry;
      const rings = geom.type === 'MultiPolygon'
        ? geom.coordinates.flat()
        : geom.coordinates;
      for (const ring of rings) {
        if (this.pointInPolygon([lng, lat], ring)) {
          return feature.properties.name;
        }
      }
    }
    return 'Unknown';
  }

  private pointInPolygon (point: [number, number], polygon: number[][]): boolean {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
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
