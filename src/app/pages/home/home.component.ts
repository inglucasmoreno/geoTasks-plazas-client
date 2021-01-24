import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
export class HomeComponent implements OnInit {

  public totalVencidas = 0;
  public loading = true;

  constructor(private tareasService: TareasService,
              private router: Router) { }

  ngOnInit(): void {
    this.listarVencidas();
  }

  listarVencidas(): void {
    this.tareasService.listarVencidas().subscribe( ({ totalTareas }) =>{
      this.totalVencidas = totalTareas;
      this.loading = false;
    });
  }

}
