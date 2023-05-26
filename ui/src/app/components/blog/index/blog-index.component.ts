import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { ImageService } from '../../../services/image.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Blog from '../../../models/entities/Blog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-question-index',
  templateUrl: './blog-index.component.html',
  styleUrls: ['./blog.index.component.scss']
})
export class BlogIndexComponent implements OnInit {
  modalRef: BsModalRef | undefined;
  public blog: Blog | undefined;

  constructor (
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly contractorService: BlogService,
    private readonly imageService: ImageService,
    private readonly modalService: BsModalService) {
  }

  openModal (template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  closeModal (): void {
    this.modalRef!.hide();
  }

  async ngOnInit (): Promise<void> {
    // this.blog = await this.contractorService.get(firstValueFrom(this.route.params).id);
  }
}
