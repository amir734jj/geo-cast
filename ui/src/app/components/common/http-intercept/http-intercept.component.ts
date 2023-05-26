import { Component,  OnInit,  TemplateRef, ViewChild } from '@angular/core';
import {  BsModalRef,  BsModalService } from 'ngx-bootstrap/modal';
import {  HttpErrorResponse } from '@angular/common/http';
import {  RequestInterceptor } from '../../../utilities/injectables/custom.error.handler.utility';
import * as _ from 'lodash';

@Component({
  selector: 'app-http-intercept',
  templateUrl: './http-intercept.component.html',
  styleUrls: ['./http-intercept.component.scss']
})
export class HttpInterceptComponent {
  exceptionMessage = '';
  errorMessage = '';
  private isOpen = false;

  @ViewChild('templateRef')
  public templateRef: TemplateRef<any> | undefined;

  private modalRef: BsModalRef | undefined;

  constructor (private readonly modalService: BsModalService,
    private readonly requestInterceptor: RequestInterceptor) {
    this.onErrorHandler = _.throttle(this.onErrorHandler);
    requestInterceptor.addOnErrorHandler(error => { this.onErrorHandler(error); });
  }

  onErrorHandler (errorResponse: HttpErrorResponse): void {
    this.exceptionMessage = errorResponse.message;
    let errorMessage: string;

    const errors = _.get(errorResponse.error, ['errors']);
    // If error has a message
    if (errors) {
      errorMessage = errors.join('\n');
    } else if (errorResponse.error instanceof Event) {
      // errorMessage = `Event : ${(of errorResponse.error).toString()}`;
    } else {
      errorMessage = _.toString(errorResponse.error);
    }

    // this.errorMessage = errorMessage;

    if (!this.isOpen) {
      this.showModal();
    }
  }

  showModal (): void {
    this.modalRef = this.modalService.show(this.templateRef!, {
      class: 'modal-lg'
    });

    this.modalService.onHide.subscribe(() => {
      this.isOpen = false;
    });

    this.isOpen = true;
  }

  hideModal (): void {
    this.modalService.hide(1);

    this.isOpen = false;
  }
}
