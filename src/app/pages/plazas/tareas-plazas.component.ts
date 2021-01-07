import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlazasService } from '../../services/plazas.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tareas-plazas',
  templateUrl: './tareas-plazas.component.html',
  styles: [
  ]
})
export class TareasPlazasComponent implements OnInit {

  public loading = true;
  public plaza = {
    _id: '',
    descripcion: '',
    tareas: []
  };
  public plazaForm = this.fb.group({
    tarea: ['', Validators.required]  
  });

  constructor(private activatedRoute: ActivatedRoute,
              private plazasService: PlazasService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.actualizarLista();
  }

  actualizarLista(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.plazasService.getPlaza(id).subscribe( plaza => {
        this.plaza = plaza;
        this.loading = false;
      })
    });  
  }

  agregarTarea(): void {
    if(this.plazaForm.status === 'VALID'){
      this.loading = true;
      const tarea = { descripcion: this.plazaForm.value.tarea };
      this.plaza.tareas.push(tarea);
      this.plazasService.actualizarPlaza(this.plaza._id, this.plaza).subscribe(() => {
        this.plazaForm.reset();
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
    this.loading = true;
    this.plaza.tareas = this.plaza.tareas.filter(tarea => tarea._id !== idTarea);
    this.plazasService.actualizarPlaza(this.plaza._id, this.plaza).subscribe(() => {
      Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'La tarea ha sido completada',
        showConfirmButton: false,
        timer: 1000
      });
      this.actualizarLista();
    });  
  }

}
