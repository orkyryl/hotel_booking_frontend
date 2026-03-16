export interface RoomDto {
  id?: number;
  roomNumber?: number;
  roomTypeName?: string;
  pricePerNight?: number;
  description?: string;
  capacity?: number;
}

export interface CreateRoomRequestDto {
  roomNumber: number;
  roomType: string;
  pricePerNight: number;
  description: string;
  capacity: number;
}

export interface UpdateRoomRequestDto extends CreateRoomRequestDto {}

export interface RoomPhotoDto {
  roomPhotoId?: number;
  roomId?: number;
  photoUrl?: string;
}

export interface AddRoomPhotoRequestDto {
  photoUrl: string;
}

export interface RoomTypeDto {
  roomTypeId?: number;
  name: string;
  description: string;
}

export interface CreateRoomTypeRequestDto {
  name: string;
  description: string;
}

export interface UpdateRoomTypeRequestDto extends CreateRoomTypeRequestDto {}
