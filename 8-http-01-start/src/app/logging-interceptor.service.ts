import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('A request has been called on url:', req.url);
    return next.handle(req).pipe(
      tap((event) => {
        console.log('response of event:', event);
      })
    );
  }
}
