import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotLoggedGuard } from './guards/notlogged.guard';
import { LoggedGuard } from './guards/logged.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [LoggedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NotLoggedGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NotLoggedGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
