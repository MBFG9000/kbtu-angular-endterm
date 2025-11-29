import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, HandMetal } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  readonly HandMetal = HandMetal; // i-lucide icon
  readonly user$!: Observable<User | null>;
  isLoggingOut = false;
  errorMessage = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.user$ = this.authService.currentUser$;
  }


  logout(): void {
    if (this.isLoggingOut) return;

    this.isLoggingOut = true;
    this.errorMessage = '';

    this.authService.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.isLoggingOut = false;
        this.errorMessage = err?.message || 'Logout failed. Try again.';
      }
    });
  }

}