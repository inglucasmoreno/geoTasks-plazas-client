import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modulos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
