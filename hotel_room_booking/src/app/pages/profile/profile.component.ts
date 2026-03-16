import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserDto } from '../../dto/user.dto';
import { AuthStateService } from '../../services/auth-state.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly user = signal<UserDto | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly rolesLabel = computed(() => {
    const u = this.user();
    if (!u?.roles?.length) return '—';
    return Array.isArray(u.roles) ? u.roles.join(', ') : String(u.roles);
  });

  constructor(
    private readonly authState: AuthStateService,
    private readonly users: UsersService,
    private readonly router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const userId = this.authState.currentUserId();
    if (userId == null) {
      await this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.users.getUser(userId));
      const u = this.normalizeUser(res);
      this.user.set(u);
      if (u) {
        this.form.patchValue({
          email: u.email,
          phoneNumber: u.phoneNumber ?? '',
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
        });
      }
    } catch (e) {
      this.error.set(this.normalizeError(e));
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId = this.authState.currentUserId();
    if (userId == null) {
      await this.router.navigate(['/login']);
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const value = this.form.getRawValue();
      const roles = this.user()?.roles ?? [];
      await firstValueFrom(
        this.users.updateUser(userId, {
          email: value.email,
          phoneNumber: value.phoneNumber,
          firstName: value.firstName,
          lastName: value.lastName,
          roles,
        }),
      );
      this.user.update((u) => (u ? { ...u, ...value } : null));
    } catch (e) {
      this.error.set(this.normalizeError(e));
    } finally {
      this.saving.set(false);
    }
  }

  private normalizeUser(res: unknown): UserDto | null {
    if (res && typeof res === 'object' && 'email' in res) {
      const o = res as Record<string, unknown>;
      return {
        userId: typeof o['userId'] === 'number' ? o['userId'] : undefined,
        email: String(o['email'] ?? ''),
        phoneNumber: String(o['phoneNumber'] ?? ''),
        roles: Array.isArray(o['roles']) ? (o['roles'] as string[]) : [],
        firstName: String(o['firstName'] ?? ''),
        lastName: String(o['lastName'] ?? ''),
      };
    }
    return null;
  }

  private normalizeError(err: unknown): string {
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
    return 'Something went wrong. Please try again.';
  }
}
