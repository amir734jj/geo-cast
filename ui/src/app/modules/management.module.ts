import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfileService } from '../services/profile.service';
import { ImageService } from '../services/image.service';
import { AccountModule } from './account.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { BlogService } from '../services/blog.service';
import { BlogManagementComponent } from '../components/management/blog/blog-management.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    AccountModule,
    FileUploadModule
  ],
  providers: [ProfileService, ImageService, BlogService],
  declarations: [BlogManagementComponent, BlogManagementComponent],
  exports: [BlogManagementComponent]
})
export class ManagementModule {

}
