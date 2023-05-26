import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlogService } from '../services/blog.service';
import { BoardComponent } from '../components/board/board.component'; // this is needed!

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule
  ],
  providers: [BlogService],
  declarations: [BoardComponent],
  exports: [BoardComponent]
})
export class BoardModule {

}
