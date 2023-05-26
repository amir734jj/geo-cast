import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs";
import { JwtFsm } from "jwt-fsm";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly jwtFsm: JwtFsm) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let headers = req.headers
      .set("Authorization", `Bearer ${this.jwtFsm.token}`)
      .append("Access-Control-Allow-Origin", "*")
      .append(
        "Access-Control-Allow-Headers",
        "origin,X-Requested-With,content-type,accept"
      )
      .append(
        "Access-Control-Allow-Headers",
        "Origin, Authorization, Content-Type, Accept"
      );

    // Let browser figure file boundary
    if (headers.get("Content-Type") === "multipart/form-data") {
      headers = headers.delete("Content-Type");
    } else if (headers.get("Content-Type") == null) {
      headers = headers.append("Content-Type", "application/json");
    }

    const authReq = req.clone({ headers });
    return next.handle(authReq).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        error: () => {},
      })
    );
  }
}
