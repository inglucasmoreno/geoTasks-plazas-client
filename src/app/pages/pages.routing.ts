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
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [ AuthGuard ],
        component: PagesComponent,
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'geolocalizar', component: GeolocalizarComponent },
            { path: 'alertas', component: AlertasComponent },
            { path: 'plazas', component: PlazasComponent },
            { path: 'plazas/tareas/:id', component: TareasPlazasComponent },
            { path: 'plazas/editar/:id', canActivate: [AdminGuard] , component: EditarPlazasComponent },
            { path: 'plazas/tareas/editar/:id', canActivate: [AdminGuard] , component: EditarTareasComponent },
            { path: 'plazas/tareas/historial/:id', canActivate: [AdminGuard] , component: TareasHistorialComponent },
            { path: 'usuarios', canActivate: [AdminGuard] , component: UsuariosComponent },
            { path: 'usuarios/nuevo', canActivate: [AdminGuard] , component: NuevoUsuarioComponent },
            { path: 'usuarios/editar/:id', canActivate: [AdminGuard] , component: EditarUsuarioComponent },
            { path: 'usuarios/password/:id', canActivate: [AdminGuard] , component: EditarPasswordComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PagesRoutingModule {}
