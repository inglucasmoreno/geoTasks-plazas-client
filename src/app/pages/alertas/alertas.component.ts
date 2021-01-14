import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { TareasService } from '../../services/tareas.service';
import { PlazasService } from '../../services/plazas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styles: [
  ]
})
export class AlertasComponent implements OnInit {

  public totales = {
    vencidas: 0,
    porVencer: 0,
    todas: 0
  }

  public paginador = {
    desdeTareas: 0,
    hastaTareas: 5,
    desdePorVencer: 0,
    hastaPorVencer: 5,
    desdeVencidas: 0,
    hastaVencidas: 5,
    limit: 5
  }
  
  public porVencer = {};
  public vencidas = {};
  public filtroDescripcionVencidas = '';
  public filtroDescripcionPorVencer = '';

  public loading = true;
  public loadingPorVencer = false;
  public loadingVencidas = false;

  constructor(private tareasService: TareasService,
              private plazasService: PlazasService,
              private router: Router) {}

  probando(): void {
    this.tareasService.toggle();
  }

  ngOnInit(): void {
    this.listarTareas();
  }

  listarTareas(): void {
    this.tareasService.listarVencidas(
      this.paginador.desdeTareas,
      this.paginador.hastaTareas,
      this.paginador.desdePorVencer,
      this.paginador.hastaPorVencer,
      this.paginador.desdeVencidas,
      this.paginador.hastaVencidas,
    ).subscribe( resp => {
      this.porVencer = resp.porVencer;
      this.vencidas = resp.vencidas;
      this.totales.porVencer = resp.totalPorVencer;
      this.totales.vencidas = resp.totalVencidas;  
      this.totales.todas = resp.totalTareas;
      this.loading = false;
      if(resp.totalTareas === 0) this.router.navigateByUrl('/dashboard/home');
    });
  }

  listarPorVencer(): void {
    this.tareasService.listarVencidas(
      this.paginador.desdeTareas,
      this.paginador.hastaTareas,
      this.paginador.desdePorVencer,
      this.paginador.hastaPorVencer,
      this.paginador.desdeVencidas,
      this.paginador.hastaVencidas,
      this.filtroDescripcionPorVencer,
      this.filtroDescripcionVencidas
    ).subscribe( resp => {
      this.porVencer = resp.porVencer;
      this.loadingPorVencer = false;
    });    
  }

  listarVencidas(): void {
    this.tareasService.listarVencidas(
      this.paginador.desdeTareas,
      this.paginador.hastaTareas,
      this.paginador.desdePorVencer,
      this.paginador.hastaPorVencer,
      this.paginador.desdeVencidas,
      this.paginador.hastaVencidas,
      this.filtroDescripcionPorVencer,
      this.filtroDescripcionVencidas
    ).subscribe( resp => {
      this.vencidas = resp.vencidas;
      this.loadingVencidas = false;
    });    
  }

  completarTarea(idTarea: string, idPlaza: string): void {
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Estas por completar una tarea",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, estoy seguro'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.tareasService.actualizarTarea(idTarea, { activo: false, fecha_completada: moment().format() }).subscribe(() => {  // Se actualiza Tarea {activo: false}
          this.plazasService.actualizarPlaza(idPlaza, { fecha_ultima_visita: moment().format() }).subscribe(() => {  // Se actualiza fecha ultima visita - Plaza
            Swal.fire({
              icon: 'success',
              title: 'Completado',
              text: 'La tarea ha sido completada',
              showConfirmButton: false,
              timer: 1000
            });
            this.listarTareas();
          });
      })
      }
    });
  }

  paginadorPorVencer(selector: string): void{
    this.loadingPorVencer = true;
    if (selector === 'siguiente'){ // Incrementar
      if (this.paginador.hastaPorVencer < this.totales.porVencer){
        this.paginador.desdePorVencer += this.paginador.limit;
        this.paginador.hastaPorVencer += this.paginador.limit;
      }
    }else{                         // Decrementar
      this.paginador.desdePorVencer -= this.paginador.limit;
      if (this.paginador.desdePorVencer < 0){
        this.paginador.desdePorVencer = 0;
      }else{
        this.paginador.hastaPorVencer -= this.paginador.limit;
      }
    }
    this.listarPorVencer();  
  }

  paginadorVencidas(selector: string): void{
    this.loadingVencidas = true;
    if (selector === 'siguiente'){ // Incrementar
      if (this.paginador.hastaVencidas < this.totales.vencidas){
        this.paginador.desdeVencidas += this.paginador.limit;
        this.paginador.hastaVencidas += this.paginador.limit;
      }
    }else{                         // Decrementar
      this.paginador.desdeVencidas -= this.paginador.limit;
      if (this.paginador.desdeVencidas < 0){
        this.paginador.desdeVencidas = 0;
      }else{
        this.paginador.hastaVencidas -= this.paginador.limit;
      }
    }
    this.listarVencidas();  
  }

  filtradoDescripcionPorVencer(filtro: string){
    this.loadingPorVencer = true;
    this.filtroDescripcionPorVencer = filtro;
    this.listarPorVencer();
  }

  filtradoDescripcionVencidas(filtro: string){
    this.loadingVencidas = true;
    this.filtroDescripcionVencidas = filtro;
    this.listarVencidas();
  }

}
