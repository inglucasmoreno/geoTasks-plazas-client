import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

import { PagesComponent } from './pages.component';
import { GeolocalizarComponent } from './geolocalizar/geolocalizar.component';
import { PlazasComponent } from './plazas/plazas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { TareasPlazasComponent } from './plazas/tareas-plazas.component';
import { HomeComponent } from './home/home.component';
import { EditarPlazasComponent } from './plazas/editar/editar-plazas.component';
import { EditarTareasComponent } from './plazas/editar/editar-tareas.component';
import { AlertasComponent } from './alertas/alertas.component';
import { TareasHistorialComponent } from './plazas/tareas-historial.component';
import { ComponentsModule } from '../components/components.module';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';

@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    GeolocalizarComponent,
    PlazasComponent,
    UsuariosComponent,
    TareasPlazasComponent,
    EditarPlazasComponent,
    EditarTareasComponent,
    AlertasComponent,
    TareasHistorialComponent,
    NuevoUsuarioComponent,
    EditarUsuarioComponent,
    EditarPasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    PipesModule,
    ComponentsModule
  ]
})
export class PagesModule { }
