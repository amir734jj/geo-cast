import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { HttpErrorResponse } from "@angular/common/http";
import { tap } from "rxjs";
import { Observable } from "rxjs";

type HttpErrorHandlerType = (_: HttpErrorResponse) => void;

@Injectable({
  providedIn: 'root'
})
export class RequestInterceptor implements HttpInterceptor {
  private ON_ERROR_HANDLERS: HttpErrorHandlerType[] = [];

  invokeErrorHandlers: (err: HttpErrorResponse) => void = (
    err: HttpErrorResponse
  ) => {
    this.ON_ERROR_HANDLERS.forEach((x) => {
      x(err);
    });
  };

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        next: () => {},
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            // do error handling here
            this.invokeErrorHandlers(err);
          }
        },
      })
    );
  }

  addOnErrorHandler(handler: HttpErrorHandlerType): void {
    this.ON_ERROR_HANDLERS.push(handler);
  }
}
