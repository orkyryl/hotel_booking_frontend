import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { AuthService } from './auth.service';

/** Adds JWT to outgoing requests. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const token = authState.token();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return next(req);
};

/** On 401, tries refresh then retries the request once. */
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
        return throwError(() => err);
      }
      if (req.url.includes('/auth/refresh_token') || req.url.includes('/auth/login')) {
        return throwError(() => err);
      }
      const userId = authState.currentUserId();
      const refresh = authState.refreshToken();
      if (userId == null || !refresh) {
        return throwError(() => err);
      }
      return auth.refreshToken({ userId, refreshToken: refresh }).pipe(
        switchMap((res: unknown) => {
          const payload = res && typeof res === 'object' ? res as Record<string, unknown> : {};
          const newToken = (payload['token'] ?? payload['accessToken']) as string | undefined;
          const newRefresh = (payload['refreshtoken'] ?? payload['refreshToken']) as string | undefined;
          if (newToken) authState.setTokens(newToken, newRefresh ?? null);
          const token = authState.token();
          const retry = token
            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
            : req;
          return next(retry);
        }),
        catchError(() => throwError(() => err)),
      );
    }),
  );
};
