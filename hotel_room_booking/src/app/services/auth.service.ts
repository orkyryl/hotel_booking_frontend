import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponseDto, ForgotPasswordRequestDto, LoginRequestDto, RefreshTokenRequestDto, RegisterRequestDto, ResetPasswordRequestDto } from '../dto/auth.dto';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly api: ApiBaseService) {}

  // POST /auth/login
  login(body: LoginRequestDto): Observable<AuthResponseDto | unknown> {
    return this.api.http.post<AuthResponseDto | unknown>(this.api.url('/auth/login'), body);
  }

  // POST /auth/register
  register(body: RegisterRequestDto): Observable<unknown> {
    return this.api.http.post(this.api.url('/auth/register'), body);
  }

  // POST /auth/refresh_token
  refreshToken(body: RefreshTokenRequestDto): Observable<AuthResponseDto | unknown> {
    return this.api.http.post<AuthResponseDto | unknown>(this.api.url('/auth/refresh_token'), body);
  }

  // POST /auth/logout
  logout(): Observable<unknown> {
    return this.api.http.post(this.api.url('/auth/logout'), null);
  }

  // POST /auth/forgot_password
  forgotPassword(body: ForgotPasswordRequestDto): Observable<unknown> {
    return this.api.http.post(this.api.url('/auth/forgot_password'), body);
  }

  // POST /auth/reset_password
  resetPassword(body: ResetPasswordRequestDto): Observable<unknown> {
    return this.api.http.post(this.api.url('/auth/reset_password'), body);
  }
}

