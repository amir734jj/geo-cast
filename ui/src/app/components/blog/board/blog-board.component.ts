import { Component, OnInit } from '@angular/core';
import { BlogService } from '../../../services/blog.service';
import Blog from '../../../models/entities/Blog';

@Component({
  selector: 'app-blog-board',
  templateUrl: './blog-board.component.html',
  styleUrls: ['./blog-board.component.scss']
})
export class BlogBoardComponent implements OnInit {
  public blogs: Blog[] = [];

  constructor (private readonly blogService: BlogService) {
  }

  async ngOnInit (): Promise<void> {
    this.blogs = await this.blogService.getAll();
  }
}
