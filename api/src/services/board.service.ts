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
  private readonly countryIndex: { name: string; minLng: number; maxLng: number; minLat: number; maxLat: number; rings: number[][][] }[];
  private readonly countryCache = new Map<string, string>();

  constructor (
    private readonly postService: PostService,
    private readonly blobServiceClient: AbstractBlobProvider
  ) {
    this.countryIndex = (worldCountries as any).features.map((feature: any) => {
      const geom = feature.geometry;
      const rings: number[][][] = geom.type === 'MultiPolygon'
        ? geom.coordinates.flat()
        : geom.coordinates;
      let minLng = Infinity; let maxLng = -Infinity; let minLat = Infinity; let maxLat = -Infinity;
      for (const ring of rings) {
        for (const [lng, lat] of ring) {
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
      }
      return { name: feature.properties.name, minLng, maxLng, minLat, maxLat, rings };
    });
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
    await this.blobServiceClient.upload(recordingId, file.buffer, file.originalname, user.id);

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
    const key = `${lng},${lat}`;
    const cached = this.countryCache.get(key);
    if (cached) return cached;

    for (const { name, minLng, maxLng, minLat, maxLat, rings } of this.countryIndex) {
      if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) continue;
      for (const ring of rings) {
        if (this.pointInPolygon([lng, lat], ring)) {
          this.countryCache.set(key, name);
          return name;
        }
      }
    }
    this.countryCache.set(key, 'Unknown');
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
