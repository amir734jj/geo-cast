import { Injectable } from '@angular/core';
import { List } from 'immutable';
import { HttpErrorResponse } from '@angular/common/http';

export type ResponseHandlerT = (response: HttpErrorResponse) => void

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerStoreUtility {
  public store = List<ResponseHandlerT>();
}
