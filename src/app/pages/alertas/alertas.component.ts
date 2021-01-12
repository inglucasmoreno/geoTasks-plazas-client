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
  
  public porVencer = {};
  public vencidas = {};

  public loading = true;

  constructor(private tareasService: TareasService,
              private plazasService: PlazasService,
              private router: Router) {}

  ngOnInit(): void {
    this.listarTareas();
  }

  listarTareas(): void {
    this.tareasService.listarVencidas().subscribe( resp => {
      console.log(resp);
      this.porVencer = resp.porVencer;
      this.vencidas = resp.vencidas;
      this.totales.porVencer = resp.totalPorVencer;
      this.totales.vencidas = resp.totalVencidas;  
      this.totales.todas = resp.totalTareas;
      this.loading = false;
      if(resp.totalTareas === 0) this.router.navigateByUrl('/dashboard/home');
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

}
