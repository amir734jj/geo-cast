import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogIndexComponent } from '../components/blog/index/blog-index.component';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogService } from '../services/blog.service';
import { BlogBoardComponent } from '../components/blog/board/blog-board.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [BlogService],
  declarations: [BlogIndexComponent, BlogBoardComponent],
  exports: [BlogIndexComponent, BlogBoardComponent]
})
export class BlogModule {

}
