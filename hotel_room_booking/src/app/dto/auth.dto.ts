export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RefreshTokenRequestDto {
  userId: number;
  refreshToken: string;
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  token: string;
  newPassword: string;
}

export interface AuthResponseDto {
  token?: string;
  refreshtoken?: string;
  userId?: number;
}
