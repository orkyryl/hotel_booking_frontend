import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RoomDto } from './dto/room.dto';
import { RoomsService } from './services/rooms.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected readonly title = signal('Hotel Room Booking');

  readonly searchForm = new FormGroup({
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    checkIn: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    checkOut: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    guests: new FormControl(2, {
      nonNullable: true,
      validators: [Validators.min(1), Validators.max(10)],
    }),
  });

  readonly canSearch = computed(() => this.searchForm.valid);

  readonly rooms = signal<RoomDto[]>([]);
  readonly isLoadingRooms = signal(false);
  readonly roomsError = signal<string | null>(null);

  constructor(private readonly roomsApi: RoomsService) {}

  ngAfterViewInit(): void {
    document.body.classList.add('app-ready');
  }

  async onSearch(): Promise<void> {
    if (!this.searchForm.valid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const value = this.searchForm.getRawValue();
    const checkInIso = toIsoDateTime(value.checkIn);
    const checkOutIso = toIsoDateTime(value.checkOut);

    this.isLoadingRooms.set(true);
    this.roomsError.set(null);

    try {
      // Swagger: GET /rooms/available_rooms
      const res = await firstValueFrom(this.roomsApi.getAvailableRooms(checkInIso, checkOutIso));
      const rooms = unwrapRooms(res);
      this.rooms.set(rooms);
      window.location.hash = '#featured';
    } catch (e) {
      this.rooms.set([]);
      this.roomsError.set(normalizeError(e));
    } finally {
      this.isLoadingRooms.set(false);
    }
  }
}

function toIsoDateTime(dateOnly: string): string {
  // Swagger expects string($date-time). The `<input type="date">` returns YYYY-MM-DD.
  // Converting to ISO makes backend parsing consistent.
  return new Date(dateOnly).toISOString();
}

function normalizeError(err: unknown): string {
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as any).message === 'string'
  ) {
    return (err as any).message;
  }
  return 'Failed to load rooms. Check API_BASE_URL and backend CORS/HTTPS settings.';
}

function unwrapRooms(res: unknown): RoomDto[] {
  if (Array.isArray(res)) return res as RoomDto[];
  if (res && typeof res === 'object') {
    const anyRes = res as any;
    if (Array.isArray(anyRes.data)) return anyRes.data as RoomDto[];
    if (Array.isArray(anyRes.rooms)) return anyRes.rooms as RoomDto[];
    if (Array.isArray(anyRes.result)) return anyRes.result as RoomDto[];
  }
  return [];
}
