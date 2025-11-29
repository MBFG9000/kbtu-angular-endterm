import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AboutComponent } from './about/about.component';
import { SneakersComponent } from './sneakers/sneakers.component';
import { DetailedSneakersComponent } from './detailed-sneakers/detailed-sneakers.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProfileComponent } from './profile/profile.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'home', component: MainComponent },
    { path: 'about', component: AboutComponent },
    { path: 'items', component: SneakersComponent },
    { path: 'items/:id', component: DetailedSneakersComponent },
    { path: 'sneakers', redirectTo: 'items', pathMatch: 'full' },
    { path: 'sneakers/:id', component: DetailedSneakersComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'signup', component: SignUpComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full'}  
];
