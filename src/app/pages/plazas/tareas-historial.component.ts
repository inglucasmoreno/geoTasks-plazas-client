import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlazasService } from 'src/app/services/plazas.service';
import { TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-tareas-historial',
  templateUrl: './tareas-historial.component.html',
  styles: [
  ]
})
export class TareasHistorialComponent implements OnInit {

  public plaza = {_id:'', descripcion: '' };
  public tareas = [];
  public loading = true;
  
  // Paginador
  public totalCompletadas = 0;
  public limit = 10;
  public desde = 0;
  public hasta = 10;

  constructor(private activatedRoute: ActivatedRoute,
              private plazasService: PlazasService,
              private tareasService: TareasService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.getPlaza(id);
    });
  }

  // Obtener datos de plaza
  getPlaza(id: string): void {
    this.plazasService.getPlaza(id).subscribe( plaza => {
      this.plaza = plaza;
      this.listarCompletadas();    
    })      
  }

  // Obtener tareas completadas
  listarCompletadas(): void {
    this.tareasService.tareasPlaza(
      this.plaza._id,
      this.desde,
      this.limit
    ).subscribe(resp => {
      this.totalCompletadas = resp.total;
      this.tareas = resp.tareas;
      this.loading = false;
    });    
  }

  // Manejo de paginador
  paginador(selector): void {
    this.loading = true;
    if (selector === 'siguiente'){   // Incrementar
      if (this.hasta < this.totalCompletadas){
        this.desde += this.limit;
        this.hasta += this.limit;
      }
    }else{                           // Decrementar
      this.desde -= this.limit;
      if (this.desde < 0){
        this.desde = 0;
      }else{
        this.hasta -= this.limit;
      }
    }

    this.listarCompletadas();
  }

}
