import { HttpEventType, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const clonedRequest = req.clone({
    setHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Call the next handler with the cloned request
  return next(clonedRequest);
};


