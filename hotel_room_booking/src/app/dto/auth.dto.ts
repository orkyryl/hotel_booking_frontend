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

// Response shape isn’t shown in the PDF text export, so keep it flexible.
export interface AuthResponseDto {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  expiresInSeconds?: number;
  tokenType?: string;
}

