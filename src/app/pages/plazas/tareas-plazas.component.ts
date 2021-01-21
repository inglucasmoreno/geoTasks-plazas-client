import { Component, ModuleWithComponentFactories, OnInit } from '@angular/core';
import {PdfMakeWrapper, Table, Txt} from 'pdfmake-wrapper';
import { DeviceDetectorService } from 'ngx-device-detector';
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
              private fb: FormBuilder,
              private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.actualizarLista();
  }

 // Generar reporte PDF - Tareas pendientes
 reporte(): void {
  const hoy = moment().format('DD/MM/YYYY');
  const pdf = new PdfMakeWrapper();
  
  pdf.info({
    title: `Tareas pendientes | ${hoy}`,
    author: 'GeoTasks - Plazas',
    subject: 'Reportes'      
  });
  
  // Cabecera
  const header = new Txt(`MUNICIPALIDAD DE LA CIUDAD DE SAN LUIS`).alignment('center')
                                                                  .margin(10)
                                                                  .bold()
                                                                  .fontSize(13)
                                                                  .end;
  
  const titulo = new Txt(`Tareas pendientes | Fecha del reporte - ${hoy}`).margin([0,10,0,0]).fontSize(12).end;
  const subTitulo = new Txt(`Ubicación - ${this.plaza.descripcion}`).margin([0,10,0,0]).fontSize(12).bold().end;
  const totales = new Txt(`TAREAS TOTALES: ${this.totalTareas}`).bold().fontSize(11).margin([0,10,0,0]).end;
  const tareasReporte = this.extractData();
  const tabla = new Table([
    [ new Txt(`Descripción`).bold().end, new Txt('Fecha creación').bold().end, new Txt('Fecha limite').bold().end],
    ...tareasReporte
  ])
  .alignment('justify')
  .fontSize(11)
  .margin([0,10,0,0])
  .widths(['*', 100, 100])
  .layout({
    fillColor: (rowIndex: number, node: any, columnIndex: number) => {
      return rowIndex === 0 ? '#CCCCCC' : '';
    },    
  })
  .end;

  const isMobile = this.deviceService.isMobile();
  const isDesktop = this.deviceService.isDesktop();
  const isTablet = this.deviceService.isTablet();

  pdf.add(header);
  pdf.add(titulo);
  pdf.add(subTitulo);
  pdf.add(totales);
  pdf.add(tabla);

  if(isMobile || isTablet){
    pdf.create().download(); // Se genera PDF y se descarga    
  }else{
    pdf.create().open(); // Se genera PDF y se abre en otra pestaña  
  }

}

extractData(): any{
  return this.tareas.map( tarea => [
                  tarea.descripcion, 
                  moment(tarea.fecha_creacion).format('DD/MM/YYYY'),
                  moment(tarea.fecha_limite).format('DD/MM/YYYY'),
    ],
  );
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
