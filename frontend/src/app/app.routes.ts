import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/main-page/main-page').then(m => m.MainPageComponent)
    },
    {
        path: 'homepage',
        redirectTo: '',
        pathMatch: 'full'
    }
];
