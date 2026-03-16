import { Injectable, signal, computed } from '@angular/core';

const USER_ID_KEY = 'hotel_booking_user_id';
const TOKEN_KEY = 'hotel_booking_token';
const REFRESH_TOKEN_KEY = 'hotel_booking_refreshtoken';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly userIdSignal = signal<number | null>(this.readUserId());
  private readonly tokenSignal = signal<string | null>(this.readToken());
  private readonly refreshTokenSignal = signal<string | null>(this.readRefreshToken());

  readonly currentUserId = this.userIdSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly refreshToken = this.refreshTokenSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.userIdSignal() != null && this.tokenSignal() != null);

  setUser(userId: number, token: string | null, refreshtoken?: string | null): void {
    this.userIdSignal.set(userId);
    this.tokenSignal.set(token ?? null);
    this.refreshTokenSignal.set(refreshtoken ?? null);
    try {
      sessionStorage.setItem(USER_ID_KEY, String(userId));
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
      if (refreshtoken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshtoken);
      else sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  setTokens(token: string | null, refreshtoken?: string | null): void {
    this.tokenSignal.set(token ?? null);
    this.refreshTokenSignal.set(refreshtoken ?? null);
    try {
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
      if (refreshtoken) sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshtoken);
      else sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  clearUser(): void {
    this.userIdSignal.set(null);
    this.tokenSignal.set(null);
    this.refreshTokenSignal.set(null);
    try {
      sessionStorage.removeItem(USER_ID_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      // ignore
    }
  }

  private readUserId(): number | null {
    try {
      const v = sessionStorage.getItem(USER_ID_KEY);
      if (v == null) return null;
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }

  private readToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readRefreshToken(): string | null {
    try {
      return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  }
}
