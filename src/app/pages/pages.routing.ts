import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { GeolocalizarComponent } from './geolocalizar/geolocalizar.component';
import { PlazasComponent } from './plazas/plazas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TareasPlazasComponent } from './plazas/tareas-plazas.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        children: [
            { path: 'home', canActivate: [AuthGuard] , component: HomeComponent },
            { path: 'geolocalizar', canActivate: [AuthGuard] , component: GeolocalizarComponent },
            { path: 'plazas', canActivate: [AuthGuard] , component: PlazasComponent },
            { path: 'tareas-plazas/:id', canActivate: [AuthGuard] , component: TareasPlazasComponent },
            { path: 'usuarios', canActivate: [AuthGuard] , component: UsuariosComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule {}