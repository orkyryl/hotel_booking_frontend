import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CreateRoomRequestDto, RoomDto, RoomTypeDto } from '../../dto/room.dto';
import { RoomsService } from '../../services/rooms.service';

@Component({
  selector: 'app-admin-room-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-room-form.component.html',
  styleUrl: './admin-room-form.component.css',
})
export class AdminRoomFormComponent implements OnInit {
  readonly form = new FormGroup({
    roomNumber: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    roomType: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pricePerNight: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    capacity: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  readonly isCreate = signal(true);
  readonly roomId = signal<number | null>(null);
  readonly roomTypes = signal<RoomTypeDto[]>([]);
  readonly loading = signal(false);
  readonly loadingTypes = signal(true);
  readonly saving = signal(false);
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);
  readonly deleteError = signal<string | null>(null);

  readonly heading = computed(() => (this.isCreate() ? 'Create room' : 'Update room'));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly rooms: RoomsService,
  ) {}

  async ngOnInit(): Promise<void> {
    const configPath = this.route.snapshot.routeConfig?.path ?? '';
    const urlPath = this.router.url.split('?')[0].split('#')[0];
    const isNewRoute =
      configPath === 'new' ||
      configPath === 'admin/rooms/new' ||
      /\/admin\/rooms\/new\/?$/.test(urlPath);

    if (isNewRoute) {
      this.isCreate.set(true);
      this.roomId.set(null);
    } else {
      this.isCreate.set(false);
      const idStr = resolveRoomIdParam(this.route, urlPath);
      const id = idStr != null ? parseInt(idStr, 10) : NaN;
      if (!Number.isFinite(id)) {
        this.error.set('Invalid room ID');
        this.loading.set(false);
        return;
      }
      this.roomId.set(id);
    }

    this.loadingTypes.set(true);
    try {
      const rt = await firstValueFrom(this.rooms.getRoomTypes());
      this.roomTypes.set(unwrapRoomTypes(rt));
    } catch {
      this.roomTypes.set([]);
    } finally {
      this.loadingTypes.set(false);
    }

    if (!this.isCreate()) {
      const id = this.roomId();
      if (id == null) return;
      this.loading.set(true);
      this.error.set(null);
      try {
        const res = await firstValueFrom(this.rooms.getRoom(id));
        const room = normalizeRoom(res);
        if (!room) {
          this.error.set('Room not found');
          return;
        }
        this.form.patchValue({
          roomNumber: room.roomNumber ?? null,
          roomType: room.roomTypeName ?? '',
          pricePerNight: room.pricePerNight ?? null,
          description: room.description ?? '',
          capacity: room.capacity ?? null,
        });
      } catch (e) {
        this.error.set(normalizeError(e));
      } finally {
        this.loading.set(false);
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const body: CreateRoomRequestDto = {
      roomNumber: Number(v.roomNumber),
      roomType: v.roomType,
      pricePerNight: Number(v.pricePerNight),
      description: v.description,
      capacity: Number(v.capacity),
    };

    this.saving.set(true);
    this.error.set(null);

    try {
      if (this.isCreate()) {
        await firstValueFrom(this.rooms.createRoom(body));
        await this.router.navigate(['/']);
      } else {
        const id = this.roomId();
        if (id == null) return;
        await firstValueFrom(this.rooms.updateRoom(id, body));
        await this.router.navigate(['/room', id]);
      }
    } catch (e) {
      this.error.set(normalizeError(e));
    } finally {
      this.saving.set(false);
    }
  }

  async onDeleteRoom(): Promise<void> {
    if (this.isCreate()) return;
    const id = this.roomId();
    if (id == null) return;

    const rn = this.form.get('roomNumber')?.value;
    const label = rn != null ? `Room #${rn}` : 'this room';
    if (!confirm(`Delete ${label}? This cannot be undone.`)) return;

    this.deleting.set(true);
    this.deleteError.set(null);

    try {
      await firstValueFrom(this.rooms.deleteRoom(id));
      await this.router.navigate(['/']);
    } catch (e) {
      this.deleteError.set(normalizeError(e));
    } finally {
      this.deleting.set(false);
    }
  }
}

/**
 * `paramMap` for multi-segment routes like `admin/rooms/:id/edit` is not always on the
 * injected `ActivatedRoute` snapshot; walk parents and fall back to the URL.
 */
function resolveRoomIdParam(route: ActivatedRoute, urlPath: string): string | null {
  let r: ActivatedRoute | null = route;
  while (r) {
    const v = r.snapshot.paramMap.get('id');
    if (v != null) return v;
    r = r.parent;
  }
  const fromUrl = urlPath.match(/\/admin\/rooms\/(\d+)\/edit\/?$/);
  return fromUrl != null ? fromUrl[1] : null;
}

function unwrapRoomTypes(res: unknown): RoomTypeDto[] {
  if (Array.isArray(res)) return res as RoomTypeDto[];
  if (res && typeof res === 'object') {
    const o = res as Record<string, unknown>;
    if (Array.isArray(o['data'])) return o['data'] as RoomTypeDto[];
  }
  return [];
}

function normalizeRoom(res: unknown): RoomDto | null {
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

function normalizeError(err: unknown): string {
  if (err && typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (
      obj['error'] &&
      typeof obj['error'] === 'object' &&
      typeof (obj['error'] as Record<string, unknown>)['message'] === 'string'
    ) {
      return (obj['error'] as Record<string, string>)['message'];
    }
    if (typeof obj['error'] === 'string') return obj['error'];
    if (typeof obj['message'] === 'string') return obj['message'];
  }
  return 'Could not save room. Please try again.';
}
