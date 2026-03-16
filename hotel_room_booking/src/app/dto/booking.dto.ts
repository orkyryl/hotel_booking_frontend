export interface BookingModelDto {
  checkInDate: string;  // date-time
  checkOutDate: string; // date-time
}

export interface BookingDto extends BookingModelDto {
  bookingId?: number;
  userId?: number;
  roomId?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingLogDto {
  bookingLogId?: number;
  bookingId?: number;
  message?: string;
  createdAt?: string;
}

