import {
  HttpContextToken,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { LoadingService } from '../services/loading.service';
export const SHOULD_TRACK_LOADING = new HttpContextToken(() => false);
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const shouldTrack = req.context.get(SHOULD_TRACK_LOADING);

  if (!shouldTrack) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.setLoading(true);

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.info(event);
      }
    }),
    catchError((err) => {
      console.error(err);
      return throwError(() => err);
    }),
    finalize(() => {
      loadingService.setLoading(false);
    })
  );
};
