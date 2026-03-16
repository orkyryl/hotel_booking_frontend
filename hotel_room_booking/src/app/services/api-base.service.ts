import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from './api.tokens';

@Injectable({ providedIn: 'root' })
export class ApiBaseService {
  constructor(
    readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`;
  }
}

