import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-sign-up',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  isSubmitting = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { email, password, confirmPassword } = this.signupForm.value;
    if (!email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService
      .signup(email, password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigateByUrl('/profile');
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorMessage = err?.message || 'Unable to sign up right now.';
        }
      });
  }
}
