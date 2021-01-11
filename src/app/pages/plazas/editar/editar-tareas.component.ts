import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { TareasService } from '../../../services/tareas.service';

@Component({
  selector: 'app-editar-tareas',
  templateUrl: './editar-tareas.component.html',
  styleUrls: []
})
export class EditarTareasComponent implements OnInit {

  public loading = true;
  public hoy = moment().format('YYYY-MM-DD');
  public plaza = { _id: '', descripcion: '' };
  public tarea = { _id: '', descripcion: '', fecha_limite: ''};

  constructor(private fb: FormBuilder,
              private tareasService: TareasService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  public tareaForm = this.fb.group({
    descripcion: ['', Validators.required],
    fecha_limite: [this.hoy, Validators.required]
  }); 

  ngOnInit(): void {    
    this.activatedRoute.params.subscribe( ({id}) => {
      this.getTarea(id);
    })
  }

  getTarea(id: string): void {
    this.loading = true;
    this.tareasService.getTarea(id).subscribe( tarea => {
      this.tarea = tarea;
      this.plaza = tarea.plaza;
      this.tareaForm.setValue({
        descripcion: tarea.descripcion,
        fecha_limite: moment(tarea.fecha_limite).format('YYYY-MM-DD')
      })
      this.loading = false;
    })    
  }

  editarTarea(): void {
    if(this.tareaForm.status === 'VALID'){
      this.loading = true;
      const data = {
        descripcion: this.tareaForm.value.descripcion,
        fecha_limite: moment(this.tareaForm.value.fecha_limite).format()
      }
      this.tareasService.actualizarTarea(this.tarea._id, data).subscribe(resp => {
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'Actualización completada',
          showConfirmButton: false,
          timer: 1000
        });
        this.loading = false;
        this.router.navigateByUrl(`/dashboard/plazas/tareas/${this.plaza._id}`);
      }); 
    }else{
      this.loading = false;
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Debe colocar una tarea',
        confirmButtonText: 'Entendido'
      });
    } 
  }

}
