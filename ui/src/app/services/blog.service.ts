import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import CrudService from './abstracts/crud.service';
import Blog from '../models/entities/Blog';

@Injectable()
export class BlogService extends CrudService<Blog> {
  constructor (private readonly http: HttpClient) {
    super();
  }

  resolveHttpClient (): HttpClient {
    return this.http;
  }

  resolveRoute (): string {
    return 'contractor';
  }

  default (): Blog {
    return {} as Blog;
  }
}
