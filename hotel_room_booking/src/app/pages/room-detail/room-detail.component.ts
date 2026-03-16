import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RoomDto, RoomPhotoDto } from '../../dto/room.dto';
import { RoomsService } from '../../services/rooms.service';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.css',
})
export class RoomDetailComponent implements OnInit {
  readonly room = signal<RoomDto | null>(null);
  readonly photos = signal<RoomPhotoDto[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly title = computed(() => {
    const r = this.room();
    if (!r) return 'Room';
    if (r.roomNumber != null) return `Room #${r.roomNumber}`;
    if (r.id != null) return `Room ${r.id}`;
    return r.roomTypeName ?? 'Room';
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rooms: RoomsService,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    const roomId = id != null ? parseInt(id, 10) : NaN;
    if (!Number.isFinite(roomId)) {
      this.error.set('Invalid room ID');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const roomRes = await firstValueFrom(this.rooms.getRoom(roomId));
      const r = this.normalizeRoom(roomRes);
      this.room.set(r);

      if (r) {
        try {
          const photosRes = await firstValueFrom(this.rooms.getRoomPhotos(roomId));
          const list = this.normalizePhotos(photosRes);
          this.photos.set(list);
        } catch {
          this.photos.set([]);
        }
      }
    } catch (e) {
      this.room.set(null);
      this.error.set(this.normalizeError(e));
    } finally {
      this.loading.set(false);
    }
  }

  private normalizeRoom(res: unknown): RoomDto | null {
    if (
      res &&
      typeof res === 'object' &&
      ('roomId' in res || 'roomNumber' in res || 'roomTypeName' in res)
    ) {
      const o = res as Record<string, unknown>;
      return {
        id: typeof o['roomId'] === 'number' ? o['roomId'] : undefined,
        roomNumber: typeof o['roomNumber'] === 'number' ? o['roomNumber'] : undefined,
        roomTypeName: typeof o['roomTypeName'] === 'string' ? o['roomTypeName'] : undefined,
        pricePerNight: typeof o['pricePerNight'] === 'number' ? o['pricePerNight'] : undefined,
        description: typeof o['description'] === 'string' ? o['description'] : undefined,
        capacity: typeof o['capacity'] === 'number' ? o['capacity'] : undefined,
      };
    }
    return null;
  }

  private normalizePhotos(res: unknown): RoomPhotoDto[] {
    if (Array.isArray(res)) {
      return res.map((item) => {
        if (item && typeof item === 'object') {
          const o = item as Record<string, unknown>;
          return {
            roomPhotoId: typeof o['roomPhotoId'] === 'number' ? o['roomPhotoId'] : undefined,
            roomId: typeof o['roomId'] === 'number' ? o['roomId'] : undefined,
            photoUrl: typeof o['photoUrl'] === 'string' ? o['photoUrl'] : undefined,
          };
        }
        return {};
      });
    }
    if (res && typeof res === 'object' && Array.isArray((res as Record<string, unknown>)['data'])) {
      return this.normalizePhotos((res as Record<string, unknown>)['data']);
    }
    return [];
  }

  private normalizeError(err: unknown): string {
    if (err && typeof err === 'object') {
      const obj = err as Record<string, unknown>;
      if (typeof obj['message'] === 'string') return obj['message'];
      if (
        obj['error'] &&
        typeof obj['error'] === 'object' &&
        typeof (obj['error'] as Record<string, unknown>)['message'] === 'string'
      ) {
        return (obj['error'] as Record<string, string>)['message'];
      }
      if (typeof obj['error'] === 'string') return obj['error'];
    }
    return 'Failed to load room.';
  }
}
