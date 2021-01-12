import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { GeolocalizarComponent } from './geolocalizar/geolocalizar.component';
import { PlazasComponent } from './plazas/plazas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TareasPlazasComponent } from './plazas/tareas-plazas.component';
import { EditarPlazasComponent } from './plazas/editar/editar-plazas.component';
import { EditarTareasComponent } from './plazas/editar/editar-tareas.component';
import { AlertasComponent } from './alertas/alertas.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        children: [
            { path: 'home', canActivate: [AuthGuard] , component: HomeComponent },
            { path: 'geolocalizar', canActivate: [AuthGuard] , component: GeolocalizarComponent },
            { path: 'alertas', canActivate: [AuthGuard] , component: AlertasComponent },
            { path: 'plazas', canActivate: [AuthGuard] , component: PlazasComponent },
            { path: 'plazas/tareas/:id', canActivate: [AuthGuard] , component: TareasPlazasComponent },
            { path: 'plazas/editar/:id', canActivate: [AuthGuard] , component: EditarPlazasComponent },
            { path: 'plazas/tareas/editar/:id', canActivate: [AuthGuard] , component: EditarTareasComponent },
            { path: 'usuarios', canActivate: [AuthGuard] , component: UsuariosComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule {}
