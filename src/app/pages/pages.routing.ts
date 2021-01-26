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
import { TareasHistorialComponent } from './plazas/tareas-historial.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';

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
            { path: 'plazas/tareas/historial/:id', canActivate: [AuthGuard] , component: TareasHistorialComponent },
            { path: 'usuarios', canActivate: [AuthGuard] , component: UsuariosComponent },
            { path: 'usuarios/nuevo', canActivate: [AuthGuard] , component: NuevoUsuarioComponent },
            { path: 'usuarios/editar/:id', canActivate: [AuthGuard] , component: EditarUsuarioComponent },
            { path: 'usuarios/password/:id', canActivate: [AuthGuard] , component: EditarPasswordComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule {}
