import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Plaza } from '../../models/plaza.model';
import { PlazasService } from '../../services/plazas.service';

@Component({
  selector: 'app-plazas',
  templateUrl: './plazas.component.html',
  styles: [
  ]
})
export class PlazasComponent implements OnInit {

  public plazas: Plaza[] = [];
  public total = 0;
  public limit = 5;
  public desde = 0;
  public hasta = 5;
  public filtroActivos: any = '';
  public filtroDescripcion: any = '';
  public loading = true;

  constructor(private plazasService: PlazasService) { }

  ngOnInit(): void {
    this.listarPlazas();
  }

  listarPlazas(): void{
    this.plazasService.listarPlazas(
      this.limit,
      this.desde,
      this.filtroActivos,
      this.filtroDescripcion
    ).subscribe( resp => {
      this.loading = false;
      this.plazas = resp.plazas;
      this.total = resp.total;
    });
  }

  actualizarPlaza(plaza): void{
    const { activo } = plaza;
    const data = { activo: !activo };
    Swal.fire({
      title: '¿Estas seguro?',
      text: '¿Quieres actualizar el estado de la plaza?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.plazasService.actualizarPlaza(plaza._id, data).subscribe(() => {
          this.listarPlazas();
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: 'Plaza actualizada!',
            showConfirmButton: false,
            timer: 1000
          });
        }, ({error}) => {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: error.msg,
            confirmButtonText: 'Entendido'
          });
        });
      }
    });
  }

  actualizarDesdeHasta(selector): void {
    this.loading = true;
    if (selector === 'siguiente'){ // Incrementar
      if (this.hasta < this.total){
        this.desde += this.limit;
        this.hasta += this.limit;
      }
    }else{                         // Decrementar
      this.desde -= this.limit;
      if (this.desde < 0){
        this.desde = 0;
      }else{
        this.hasta -= this.limit;
      }
    }

    this.listarPlazas();
  }

  filtradoPorLista(criterio: string): void {
    this.loading = true;
    this.filtroActivos = '';
    if (criterio === 'activos') { this.filtroActivos = true; }
    else if (criterio === 'inactivos') { this.filtroActivos = false; }
    this.listarPlazas();
  }

  filtradoPorDescripcion(descripcion: string): void {
    this.loading = true;
    this.filtroDescripcion = descripcion;
    this.listarPlazas();
  }

}
