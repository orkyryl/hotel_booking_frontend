export interface TotalBookingsDto {
  total?: number;
}

export interface OccupancyRateDto {
  rate?: number;
}

export interface AverageStayDurationDto {
  days?: number;
}

export interface PopularRoomTypesDto {
  // shape not shown in the PDF text export; keep flexible
  items?: Array<{ roomType?: string; count?: number }>;
}

export interface DailyOccupancyTrendDto {
  date?: string; // date-time or date
  occupancyRate?: number;
}

