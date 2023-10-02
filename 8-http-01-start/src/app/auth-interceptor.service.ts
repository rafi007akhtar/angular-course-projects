import {
  HttpRequest,
  HttpInterceptor,
  HttpHandler,
} from '@angular/common/http';

export class AuthIntercepterService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({
      headers: req.headers.append('test', '123'),
    });
    return next.handle(modifiedReq);
  }
}
