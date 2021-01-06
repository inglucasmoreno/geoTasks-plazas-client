import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Modulos
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

// Componentes
import { NotpagefoundComponent } from './notpagefound/notpagefound.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', canActivate:[AuthGuard], redirectTo: '/dashboard/home'},
  {path: '**', canActivate:[AuthGuard] ,component: NotpagefoundComponent}
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
