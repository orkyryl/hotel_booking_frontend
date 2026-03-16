import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateRoleRequestDto, RoleDto, UpdateRoleRequestDto } from '../dto/role.dto';
import { ApiBaseService } from './api-base.service';

@Injectable({ providedIn: 'root' })
export class RolesService {
  constructor(private readonly api: ApiBaseService) {}

  // GET /roles/all_roles
  getAllRoles(): Observable<RoleDto[] | unknown> {
    return this.api.http.get<RoleDto[] | unknown>(this.api.url('/roles/all_roles'));
  }

  // GET /roles/role?roleId=...
  getRole(roleId: number): Observable<RoleDto | unknown> {
    const params = new HttpParams().set('roleId', roleId);
    return this.api.http.get<RoleDto | unknown>(this.api.url('/roles/role'), { params });
  }

  // POST /roles/create_role
  createRole(body: CreateRoleRequestDto): Observable<unknown> {
    return this.api.http.post(this.api.url('/roles/create_role'), body);
  }

  // PUT /roles/update_role?roleId=...
  updateRole(roleId: number, body: UpdateRoleRequestDto): Observable<unknown> {
    const params = new HttpParams().set('roleId', roleId);
    return this.api.http.put(this.api.url('/roles/update_role'), body, { params });
  }

  // DELETE /roles/delete_role?roleId=...
  deleteRole(roleId: number): Observable<unknown> {
    const params = new HttpParams().set('roleId', roleId);
    return this.api.http.delete(this.api.url('/roles/delete_role'), { params });
  }
}

