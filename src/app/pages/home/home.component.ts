import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TareasService } from '../../services/tareas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  public usuarioLogin;

  public totalVencidas = 0;
  public loading = true;

  constructor(private tareasService: TareasService,
              private authService:AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
    this.listarVencidas();
  }

  listarVencidas(): void {
    this.tareasService.listarVencidas().subscribe( ({ totalTareas }) =>{
      this.totalVencidas = totalTareas;
      this.loading = false;
    });
  }

}
