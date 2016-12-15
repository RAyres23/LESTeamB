import { DashboardComponent } from './db.component';
import { HomeComponent }      from './home/home.component';
import {AuthGuard} from "../services/auth/guard.service";
import {PendingComponent} from "./pending/pending.component";
import {TalkGetComponent} from "./talks/get/index";
import {TalkEditComponent} from "./talks/edit/edit.component";

export const routes = [
    {
        path: 'dashboard',
        component: <any>DashboardComponent,
        children: [
            { path: 'home', component: <any>HomeComponent, canActivate: [AuthGuard], data: { role: 2 } },
            { path: 'pending', component: <any>PendingComponent, canActivate: [AuthGuard], data: { role: 1 } },
            { path: 'talks/:id', component: <any>TalkGetComponent, canActivate: [AuthGuard], data: { role: 2 } },
            { path: 'talks/edit/:id', component: <any>TalkEditComponent, canActivate: [AuthGuard], data: { role: 2 } },
            { path: '', redirectTo: 'home' }
        ]
    }
];