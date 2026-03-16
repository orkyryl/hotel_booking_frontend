export interface RoleDto {
  roleId?: number;
  name: string;
  description: string;
}

export interface CreateRoleRequestDto {
  name: string;
  description: string;
}

export interface UpdateRoleRequestDto extends CreateRoleRequestDto {}

