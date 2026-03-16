import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.tokens';

export interface RoomDto {
  roomId?: number;
  roomNumber?: number;
  roomType?: string;
  pricePerNight?: number;
  description?: string;
  capacity?: number;
}

@Injectable({ providedIn: 'root' })
export class RoomsApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly baseUrl: string,
  ) {}

  /**
   * Swagger: GET /rooms/all_rooms
   */
  getAllRooms(): Observable<RoomDto[]> {
    return this.http.get<RoomDto[]>(this.url('/rooms/all_rooms'));
  }

  /**
   * Swagger: GET /rooms/available_rooms?checkInDate=...&checkOutDate=...
   */
  getAvailableRooms(checkInDateIso: string, checkOutDateIso: string): Observable<RoomDto[]> {
    const params = new HttpParams()
      .set('checkInDate', checkInDateIso)
      .set('checkOutDate', checkOutDateIso);
    return this.http.get<RoomDto[]>(this.url('/rooms/available_rooms'), { params });
  }

  private url(path: string): string {
    return `${this.baseUrl.replace(/\/$/, '')}${path}`;
  }
}

