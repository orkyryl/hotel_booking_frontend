import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly auth: AuthService,
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
      await firstValueFrom(this.auth.register(this.form.getRawValue()));
      await this.router.navigate(['/login']);
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
    return 'Registration failed. Please try again.';
  }
}
