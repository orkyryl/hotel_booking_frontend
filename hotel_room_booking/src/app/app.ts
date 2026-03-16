import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStateService } from './services/auth-state.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected readonly title = signal('Hotel Room Booking');

  constructor(
    protected readonly authState: AuthStateService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  protected get isLoggedIn(): boolean {
    return this.authState.isLoggedIn();
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
