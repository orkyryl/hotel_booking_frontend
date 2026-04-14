import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from './services/auth-state.service';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('Hotel Room Booking');

  constructor(
    protected readonly authState: AuthStateService,
    private readonly auth: AuthService,
    private readonly users: UsersService,
    private readonly router: Router,
  ) {}

  protected get isLoggedIn(): boolean {
    return this.authState.isLoggedIn();
  }

  async ngOnInit(): Promise<void> {
    const userId = this.authState.currentUserId();
    if (userId == null || !this.authState.token()) return;
    try {
      const res = await firstValueFrom(this.users.getUser(userId));
      const roles = extractRolesFromUser(res);
      this.authState.setRoles(roles);
    } catch {
      // keep cached roles from sessionStorage
    }
  }

  ngAfterViewInit(): void {
    document.body.classList.add('app-ready');
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {},
      error: () => {},
    });
    this.authState.clearUser();
    this.router.navigate(['/']);
  }
}

function extractRolesFromUser(res: unknown): string[] {
  if (res && typeof res === 'object' && 'roles' in res) {
    const r = (res as Record<string, unknown>)['roles'];
    return Array.isArray(r) ? (r as string[]) : [];
  }
  return [];
}
