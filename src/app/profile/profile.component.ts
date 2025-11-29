import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  readonly user$!: Observable<User | null>;
  isLoggingOut = false;
  errorMessage = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.user$ = this.authService.currentUser$;
  }

  logout(): void {
    this.isLoggingOut = true;
    this.errorMessage = '';

    this.authService
      .logout()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isLoggingOut = false;
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.isLoggingOut = false;
          this.errorMessage = err?.message || 'Unable to log out.';
        }
      });
  }
}
