import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { PrivateComponent } from './private-component/private-component';
import { PublicComponent } from './public-component/public-component';
import { LoginComponent } from './login-component/login-component';

export const routes: Routes = [
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "private",
        component: PrivateComponent
    },
    {
        path: "public",
        component: PublicComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "**",
        redirectTo: "/home"
    }
];
