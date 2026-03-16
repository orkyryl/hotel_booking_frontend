import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingDto, BookingLogDto, BookingModelDto } from '../dto/booking.dto';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  constructor(private readonly api: ApiBaseService) {}

  // GET /bookings/user_bookings?userId=...
  getUserBookings(userId: number): Observable<BookingDto[] | unknown> {
    const params = new HttpParams().set('userId', userId);
    return this.api.http.get<BookingDto[] | unknown>(this.api.url('/bookings/user_bookings'), { params });
  }

  // GET /bookings/room_bookings?roomId=...
  getRoomBookings(roomId: number): Observable<BookingDto[] | unknown> {
    const params = new HttpParams().set('roomId', roomId);
    return this.api.http.get<BookingDto[] | unknown>(this.api.url('/bookings/room_bookings'), { params });
  }

  // GET /bookings/all_bookings
  getAllBookings(): Observable<BookingDto[] | unknown> {
    return this.api.http.get<BookingDto[] | unknown>(this.api.url('/bookings/all_bookings'));
  }

  // GET /bookings/booking?bookingId=...
  getBooking(bookingId: number): Observable<BookingDto | unknown> {
    const params = new HttpParams().set('bookingId', bookingId);
    return this.api.http.get<BookingDto | unknown>(this.api.url('/bookings/booking'), { params });
  }

  // POST /bookings/create_booking?userId=...&roomId=...
  createBooking(userId: number, roomId: number, body: BookingModelDto): Observable<unknown> {
    const params = new HttpParams().set('userId', userId).set('roomId', roomId);
    return this.api.http.post(this.api.url('/bookings/create_booking'), body, { params });
  }

  // PUT /bookings/update_booking?bookingId=...&userId=0&roomId=0
  updateBooking(bookingId: number, body: BookingModelDto, userId = 0, roomId = 0): Observable<unknown> {
    const params = new HttpParams().set('bookingId', bookingId).set('userId', userId).set('roomId', roomId);
    return this.api.http.put(this.api.url('/bookings/update_booking'), body, { params });
  }

  // DELETE /bookings/delete_booking?id=...
  deleteBooking(id: number): Observable<unknown> {
    const params = new HttpParams().set('id', id);
    return this.api.http.delete(this.api.url('/bookings/delete_booking'), { params });
  }

  // GET /bookings/booking_statuses
  getBookingStatuses(): Observable<string[] | unknown> {
    return this.api.http.get<string[] | unknown>(this.api.url('/bookings/booking_statuses'));
  }

  // PUT /bookings/update_booking_status?bookingId=...&status=...
  updateBookingStatus(bookingId: number, status: string): Observable<unknown> {
    const params = new HttpParams().set('bookingId', bookingId).set('status', status);
    return this.api.http.put(this.api.url('/bookings/update_booking_status'), null, { params });
  }

  // GET /bookings/all_booking_logs
  getAllBookingLogs(): Observable<BookingLogDto[] | unknown> {
    return this.api.http.get<BookingLogDto[] | unknown>(this.api.url('/bookings/all_booking_logs'));
  }

  // GET /bookings/booking_logs?bookingId=...
  getBookingLogs(bookingId: number): Observable<BookingLogDto[] | unknown> {
    const params = new HttpParams().set('bookingId', bookingId);
    return this.api.http.get<BookingLogDto[] | unknown>(this.api.url('/bookings/booking_logs'), { params });
  }
}

