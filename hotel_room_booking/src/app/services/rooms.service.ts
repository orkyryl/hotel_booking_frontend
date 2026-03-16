import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AddRoomPhotoRequestDto,
  CreateRoomRequestDto,
  CreateRoomTypeRequestDto,
  RoomDto,
  RoomPhotoDto,
  RoomTypeDto,
  UpdateRoomRequestDto,
  UpdateRoomTypeRequestDto,
} from '../dto/room.dto';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class RoomsService {
  constructor(private readonly api: ApiBaseService) {}

  // GET /rooms/all_rooms
  getAllRooms(): Observable<RoomDto[]> {
    return this.api.http.get<RoomDto[]>(this.api.url('/rooms/all_rooms'));
  }

  // GET /rooms/room?roomId=...
  getRoom(roomId: number): Observable<RoomDto> {
    const params = new HttpParams().set('roomId', roomId);
    return this.api.http.get<RoomDto>(this.api.url('/rooms/room'), { params });
  }

  // GET /rooms/rooms_by_type?roomTypeName=...
  getRoomsByType(roomTypeName: string): Observable<RoomDto[]> {
    const params = new HttpParams().set('roomTypeName', roomTypeName);
    return this.api.http.get<RoomDto[]>(this.api.url('/rooms/rooms_by_type'), { params });
  }

  // GET /rooms/room_by_number?roomNumber=...
  getRoomByNumber(roomNumber: number): Observable<RoomDto> {
    const params = new HttpParams().set('roomNumber', roomNumber);
    return this.api.http.get<RoomDto>(this.api.url('/rooms/room_by_number'), { params });
  }

  // GET /rooms/available_rooms?checkInDate=...&checkOutDate=...
  getAvailableRooms(checkInDateIso: string, checkOutDateIso: string): Observable<RoomDto[] | unknown> {
    const params = new HttpParams().set('checkInDate', checkInDateIso).set('checkOutDate', checkOutDateIso);
    return this.api.http.get<RoomDto[] | unknown>(this.api.url('/rooms/available_rooms'), { params });
  }

  // POST /rooms/create_room
  createRoom(body: CreateRoomRequestDto): Observable<unknown> {
    return this.api.http.post(this.api.url('/rooms/create_room'), body);
  }

  // PUT /rooms/update_room?roomId=...
  updateRoom(roomId: number, body: UpdateRoomRequestDto): Observable<unknown> {
    const params = new HttpParams().set('roomId', roomId);
    return this.api.http.put(this.api.url('/rooms/update_room'), body, { params });
  }

  // DELETE /rooms/delete_room?roomId=...
  deleteRoom(roomId: number): Observable<unknown> {
    const params = new HttpParams().set('roomId', roomId);
    return this.api.http.delete(this.api.url('/rooms/delete_room'), { params });
  }

  // GET /rooms/photos?roomId=...
  getRoomPhotos(roomId: number): Observable<RoomPhotoDto[] | unknown> {
    const params = new HttpParams().set('roomId', roomId);
    return this.api.http.get<RoomPhotoDto[] | unknown>(this.api.url('/rooms/photos'), { params });
  }

  // POST /rooms/add_photo?roomId=...
  addRoomPhoto(roomId: number, body: AddRoomPhotoRequestDto): Observable<unknown> {
    const params = new HttpParams().set('roomId', roomId);
    return this.api.http.post(this.api.url('/rooms/add_photo'), body, { params });
  }

  // DELETE /rooms/remove_photo?roomPhotoId=...
  removeRoomPhoto(roomPhotoId: number): Observable<unknown> {
    const params = new HttpParams().set('roomPhotoId', roomPhotoId);
    return this.api.http.delete(this.api.url('/rooms/remove_photo'), { params });
  }

  // GET /rooms/room_types
  getRoomTypes(): Observable<RoomTypeDto[] | unknown> {
    return this.api.http.get<RoomTypeDto[] | unknown>(this.api.url('/rooms/room_types'));
  }

  // POST /rooms/create_room_type
  createRoomType(body: CreateRoomTypeRequestDto): Observable<unknown> {
    return this.api.http.post(this.api.url('/rooms/create_room_type'), body);
  }

  // PUT /rooms/update_room_type?roomTypeId=...
  updateRoomType(roomTypeId: number, body: UpdateRoomTypeRequestDto): Observable<unknown> {
    const params = new HttpParams().set('roomTypeId', roomTypeId);
    return this.api.http.put(this.api.url('/rooms/update_room_type'), body, { params });
  }

  // DELETE /rooms/delete_room_type?roomTypeId=...
  deleteRoomType(roomTypeId: number): Observable<unknown> {
    const params = new HttpParams().set('roomTypeId', roomTypeId);
    return this.api.http.delete(this.api.url('/rooms/delete_room_type'), { params });
  }
}

