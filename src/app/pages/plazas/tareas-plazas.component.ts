import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { PlazasService } from '../../services/plazas.service';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-tareas-plazas',
  templateUrl: './tareas-plazas.component.html',
  styles: [
  ]
})
export class TareasPlazasComponent implements OnInit {

  public hoy = moment().format('YYYY-MM-DD');
  public loading = true;
  public plaza = { _id: '', descripcion: '', fecha_ultima_visita: '' };
  public tareas = [];
  public totalTareas = 0;
  public plazaForm = this.fb.group({
    tarea: ['', Validators.required],
    fechaLimite: [this.hoy, Validators.required],
  });

  constructor(private activatedRoute: ActivatedRoute,
              private tareasService: TareasService,
              private plazasService: PlazasService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.actualizarLista();
  }

  actualizarLista(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe( ({id}) => {
      this.plazasService.getPlaza(id).subscribe( (plaza: any) => {
        this.plaza = plaza;
        this.listarTareas(id);
        this.tareasService.actualizarAlerta().subscribe();
      })
    });
  }
  
  listarTareas(id: string): void {
    this.tareasService.listarTarea(id, true).subscribe( resp => {
      this.tareas = resp.tareas;
      this.totalTareas = resp.totalTareas;
      this.loading = false;
    });
  }

  agregarTarea(): void {
    if(this.plazaForm.status === 'VALID'){
      this.loading = true;
      const tarea = {
        descripcion: this.plazaForm.value.tarea,
        plaza: this.plaza._id,
        fecha_limite: moment(this.plazaForm.value.fechaLimite).format()
      };
      this.tareasService.nuevaTarea(tarea).subscribe(() => {
        this.plazaForm.setValue({
          tarea: '',
          fechaLimite: this.hoy
        });
        this.actualizarLista();
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Actualización completada',
          showConfirmButton: false,
          timer: 1000
        });
      })
    }else{
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe colocar una tarea',
        confirmButtonText: 'Entendido'
      });
    }
  }

  completarTarea(idTarea: string): void {
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
          this.plazasService.actualizarPlaza(this.plaza._id, { fecha_ultima_visita: moment().format() }).subscribe(() => {  // Se actualiza fecha ultima visita - Plaza
            Swal.fire({
              icon: 'success',
              title: 'Completado',
              text: 'La tarea ha sido completada',
              showConfirmButton: false,
              timer: 1000
            });
            this.actualizarLista();
          });
      })
      }
    });
  }

}
