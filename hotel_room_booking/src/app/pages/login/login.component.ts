import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthResponseDto } from '../../dto/auth.dto';
import { AuthStateService } from '../../services/auth-state.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      ],
    }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly auth: AuthService,
    private readonly authState: AuthStateService,
    private readonly router: Router,
  ) {}

  async onSubmit(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const res = await firstValueFrom(this.auth.login(this.form.getRawValue())) as AuthResponseDto | unknown;
      const payload = res && typeof res === 'object' ? (res as Record<string, unknown>) : {};
      const userId = (payload['userId'] as number | undefined) ?? null;
      const token = (payload['token'] as string | undefined) ?? null;
      const refreshtoken = (payload['refreshtoken'] as string | undefined) ?? null;
      if (userId != null && token) this.authState.setUser(userId, token, refreshtoken);
      await this.router.navigate(['/']);
    } catch (e) {
      this.error.set(this.normalizeError(e));
    } finally {
      this.loading.set(false);
    }
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
    }
    return 'Login failed. Please check your credentials and try again.';
  }
}
