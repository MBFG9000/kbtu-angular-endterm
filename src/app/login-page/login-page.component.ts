import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup; //объект, который хранит все FormControl 
  // внутри формы, следит за их состоянием, валидностью и значениями.
  // FormControl - это объект, который хранит значение поля, валидирует его, 
  // следит за изменениями и управляет его состоянием.

  isSubmitting = false;
  errorMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) { //invalid свойство которым контролируют валидаторы 
      this.loginForm.markAllAsTouched(); //Форма невалидна → пометь все поля touched → покажи ошибки → не отправляй форму
      return;
    }

    const { email, password } = this.loginForm.value; //деструктуризация
    if (!email || !password) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService 
      .login(email, password)
      .pipe(take(1)) //Возьми только 1 значение из Observable, а затем автоматически отмени подписку.
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigateByUrl('/profile');
        },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err?.message || 'Unable to log in right now.';
        this.loginForm.reset(); //CHANGE
      }
    });
  }
}
 