// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly currentUser$: Observable<User | null>; // нынещний юзер. если нет его тупо нулл

  constructor(private readonly auth: Auth) {
    this.currentUser$ = authState(this.auth); // инджектит актуальный Firebase Auth instance через провайдер
  }

  signup(email: string, password: string): Observable<User | null> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe( //возвращает Promise<UserCredential> создает нового юзера,если все успешно тупо вход делает
      map((cred) => cred.user), 
      catchError((error) => this.handleError(error, 'signup'))
    );
  }

  // по сути в функция просто осуществляет логин 
  login(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe( // так же возвращает Promise<UserCredential>
      map((cred) => cred.user), 
      catchError((error) => this.handleError(error, 'login'))
    );
  }


   //Выход из аккаунта.
   //Возвращает Observable<void>.

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      catchError((error) => this.handleError(error, 'logout'))
    );
  }

  // firebase.errorcode -> human readable text
  private handleError(error: any, context: 'signup' | 'login' | 'logout') {
    console.error(`[AuthService:${context}]`, error);

    let message = 'Something went wrong. Please try again.';

    // Firebase auth error codes:
    // https://firebase.google.com/docs/reference/js/auth#autherrorcodes
    switch (error?.code) {
      case 'auth/email-already-in-use':
        message = 'This email is already in use.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak. Please choose a stronger one.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        message = 'Incorrect email or password.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later.';
        break;
      case 'auth/invalid-credential':
        message = 'Incorrect email or password.';
        break;
      default:
        if (typeof error?.message === 'string') {
          message = error.message;
        }
        break;
    }

    return throwError(() => new Error(message));
  }
}
