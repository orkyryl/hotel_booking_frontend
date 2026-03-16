export interface UserDto {
  userId?: number;
  email: string;
  phoneNumber: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

export interface UpdateUserRequestDto {
  email: string;
  phoneNumber: string;
  roles: string[];
  firstName: string;
  lastName: string;
}

