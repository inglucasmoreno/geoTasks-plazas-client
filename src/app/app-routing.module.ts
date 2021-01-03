import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Modulos
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

// Componentes
import { NotpagefoundComponent } from './notpagefound/notpagefound.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: '/dashboard/home'},
  {path: '**', component: NotpagefoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
