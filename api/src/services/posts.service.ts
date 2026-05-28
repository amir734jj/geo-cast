import { Repository } from 'typeorm';
import Post from '../models/post.model';
import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractDal } from '../abstracts/abstract.dal';
import { type Coordinate } from '@geo-cast/lib/dto/board/common';
import SqlString from 'sqlstring';
import User from '../models/users.model';

@Injectable()
export default class PostService extends AbstractDal<Post> {
  repository: Repository<Post> = this.connection;

  constructor (
    @InjectRepository(Post) private readonly connection: Repository<Post>
  ) {
    super();
  }

  public async query (count: number = 10, page: number = 1, coordinate: Coordinate): Promise<Post[]> {
    const cleanUser = (user: any) => _.pick(user, ['id', 'name']);

    return (await this.repository.createQueryBuilder('post')
      .addSelect(SqlString.format('((post.latitude - (?)) * (post.latitude - (?))) + ((post.longitude - (?)) * (post.longitude - (?)))', [
        coordinate.latitude,
        coordinate.latitude,
        coordinate.longitude,
        coordinate.longitude
      ]), 'distance')
      .innerJoinAndSelect('post.user', 'user')
      .take(count)
      .skip(count * (page - 1))
      .where('user.active = :active', { active: true })
      .orderBy('distance', 'ASC')
      .addOrderBy('post.createdAt', 'DESC')
      .getMany())
      .map(({ user = {}, likedBy = [], ...row }) => ({
        ...row,
        user: cleanUser(user),
        likedBy: likedBy.map(cleanUser)
      })) as Post[];
  }

  public async queryByUser (userId: number): Promise<Post[]> {
    const cleanUser = (user: any) => _.pick(user, ['id', 'name']);

    return (await this.repository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    })).map(({ user = {}, likedBy = [], ...row }) => ({
      ...row,
      user: cleanUser(user),
      likedBy: (likedBy ?? []).map(cleanUser)
    })) as Post[];
  }

  public async getCoordinates (): Promise<{latitude: number; longitude: number}[]> {
    return await this.repository.createQueryBuilder('post')
      .select(['post.latitude', 'post.longitude'])
      .innerJoin('post.user', 'user')
      .where('user.active = :active', { active: true })
      .getMany() as {latitude: number; longitude: number}[];
  }

  resolver (partial: Partial<Post>): Post {
    return _.extend(new Post(), partial);
  }

  override includes = ['user'];
}
