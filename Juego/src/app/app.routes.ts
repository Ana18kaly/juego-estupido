import { Routes } from '@angular/router';
import {RegisterComponent} from './register/register.component'
import {LoginComponent} from './login/login.component'
import {VerficationComponent} from './verfication/verfication.component'
import {HomeComponent} from './home/home.component'
import {ScoreComponent} from './score/score.component'
import {GameComponent} from './game/game.component'
import {ErrorComponent} from './error/error.component'
import { CancelComponent } from './cancel/cancel.component';
import { HistoryComponent } from './history/history.component';

export const routes: Routes = [
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: 'verfication', component: VerficationComponent},
    {path: 'home', component: HomeComponent},
    {path: 'score', component: ScoreComponent},
    {path: 'game', component: GameComponent},
    {path: 'cancel', component: CancelComponent},
    {path: 'history', component: HistoryComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', title: 'OOPS... algo salio mal' ,component: ErrorComponent}
  
];