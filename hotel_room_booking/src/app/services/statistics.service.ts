import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AverageStayDurationDto,
  DailyOccupancyTrendDto,
  OccupancyRateDto,
  PopularRoomTypesDto,
  TotalBookingsDto,
} from '../dto/statistics.dto';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor(private readonly api: ApiBaseService) {}

  // GET /statistics/total_bookings?StartDate=...&EndDate=...
  totalBookings(startDateIso: string, endDateIso: string): Observable<TotalBookingsDto | number | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<TotalBookingsDto | number | unknown>(this.api.url('/statistics/total_bookings'), { params });
  }

  // GET /statistics/occupancy_rate?StartDate=...&EndDate=...
  occupancyRate(startDateIso: string, endDateIso: string): Observable<OccupancyRateDto | number | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<OccupancyRateDto | number | unknown>(this.api.url('/statistics/occupancy_rate'), { params });
  }

  // GET /statistics/popular_room_types?StartDate=...&EndDate=...
  popularRoomTypes(startDateIso: string, endDateIso: string): Observable<PopularRoomTypesDto | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<PopularRoomTypesDto | unknown>(this.api.url('/statistics/popular_room_types'), { params });
  }

  // GET /statistics/average_stay_duration?StartDate=...&EndDate=...
  averageStayDuration(startDateIso: string, endDateIso: string): Observable<AverageStayDurationDto | number | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<AverageStayDurationDto | number | unknown>(this.api.url('/statistics/average_stay_duration'), { params });
  }

  // GET /statistics/cancelled_bookings?StartDate=...&EndDate=...
  cancelledBookings(startDateIso: string, endDateIso: string): Observable<number | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<number | unknown>(this.api.url('/statistics/cancelled_bookings'), { params });
  }

  // GET /statistics/new_users?StartDate=...&EndDate=...
  newUsers(startDateIso: string, endDateIso: string): Observable<number | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<number | unknown>(this.api.url('/statistics/new_users'), { params });
  }

  // GET /statistics/revenue?StartDate=...&EndDate=...
  revenue(startDateIso: string, endDateIso: string): Observable<number | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<number | unknown>(this.api.url('/statistics/revenue'), { params });
  }

  // GET /statistics/room_occupancy?roomId=...&StartDate=...&EndDate=...
  roomOccupancy(roomId: number, startDateIso: string, endDateIso: string): Observable<number | OccupancyRateDto | unknown> {
    const params = new HttpParams().set('roomId', roomId).set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<number | OccupancyRateDto | unknown>(this.api.url('/statistics/room_occupancy'), { params });
  }

  // GET /statistics/daily_occupancy_trends?StartDate=...&EndDate=...
  dailyOccupancyTrends(startDateIso: string, endDateIso: string): Observable<DailyOccupancyTrendDto[] | unknown> {
    const params = new HttpParams().set('StartDate', startDateIso).set('EndDate', endDateIso);
    return this.api.http.get<DailyOccupancyTrendDto[] | unknown>(this.api.url('/statistics/daily_occupancy_trends'), { params });
  }
}

