import { Repository } from 'typeorm';
import Post from '../models/post.model';
import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractDal } from '../abstracts/abstract.dal';

@Injectable()
export default class PostService extends AbstractDal<Post> {
  repository: Repository<Post> = this.connection;

  constructor(
    @InjectRepository(Post) private readonly connection: Repository<Post>,
  ) {
    super();
  }

  resolver(partial: Partial<Post>): Post {
    return _.extend(new Post(), partial);
  }

  override includes = ['user'];
}
