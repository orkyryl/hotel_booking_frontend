import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdateUserRequestDto, UserDto } from '../dto/user.dto';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly api: ApiBaseService) {}

  // GET /users/all_users
  getAllUsers(): Observable<UserDto[] | unknown> {
    return this.api.http.get<UserDto[] | unknown>(this.api.url('/users/all_users'));
  }

  // GET /users/user?userId=...
  getUser(userId: number): Observable<UserDto | unknown> {
    const params = new HttpParams().set('userId', userId);
    return this.api.http.get<UserDto | unknown>(this.api.url('/users/user'), { params });
  }

  // PUT /users/update_user?userId=...
  updateUser(userId: number, body: UpdateUserRequestDto): Observable<unknown> {
    const params = new HttpParams().set('userId', userId);
    return this.api.http.put(this.api.url('/users/update_user'), body, { params });
  }

  // DELETE /users/delete_user?userId=...
  deleteUser(userId: number): Observable<unknown> {
    const params = new HttpParams().set('userId', userId);
    return this.api.http.delete(this.api.url('/users/delete_user'), { params });
  }
}

