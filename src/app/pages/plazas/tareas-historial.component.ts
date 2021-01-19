import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlazasService } from 'src/app/services/plazas.service';
import { TareasService } from '../../services/tareas.service';
import {PdfMakeWrapper, Table, Txt} from 'pdfmake-wrapper';
import * as moment from 'moment';

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

  // Generar reporte PDF - Tareas completadas
  reporte(): void {
    const hoy = moment().format('DD/MM/YYYY');
    const pdf = new PdfMakeWrapper();
    
    pdf.info({
      title: `Tareas completadas | ${hoy}`,
      author: 'GeoTasks - Plazas',
      subject: 'Reportes'      
    });
    
    // Cabecera
    const header = new Txt(`MUNICIPALIDAD DE LA CIUDAD DE SAN LUIS`).alignment('center')
                                                                    .margin(10)
                                                                    .bold()
                                                                    .fontSize(13)
                                                                    .end;
    
    const titulo = new Txt(`Tareas completadas | Fecha del reporte - ${hoy}`).margin([0,10,0,0]).fontSize(12).end;
    const subTitulo = new Txt(`Ubicación - ${this.plaza.descripcion}`).margin([0,10,0,0]).fontSize(12).bold().end;
    const totales = new Txt(`TAREAS TOTALES: ${this.totalCompletadas}`).bold().fontSize(11).margin([0,10,0,0]).end;
    const tareasReporte = this.extractData();
    const tabla = new Table([
      [ new Txt(`Descripción`).bold().end, new Txt('Fecha creación').bold().end, new Txt('Fecha limite').bold().end, new Txt('Fecha completada').bold().end],
      ...tareasReporte
    ])
    .alignment('justify')
    .fontSize(11)
    .margin([0,10,0,0])
    .widths(['*', 120, 120, 120])
    .layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex === 0 ? '#CCCCCC' : '';
      },    
    })
    .end;

    pdf.pageOrientation('landscape');
    pdf.add(header);
    pdf.add(titulo);
    pdf.add(subTitulo);
    pdf.add(totales);
    pdf.add(tabla);
    pdf.create().open();

  }

  extractData(): any{
    return this.tareas.map( tarea => [
                    tarea.descripcion, 
                    moment(tarea.fecha_creacion).format('DD/MM/YYYY'),
                    moment(tarea.fecha_limite).format('DD/MM/YYYY'),
                    moment(tarea.fecha_completada).format('DD/MM/YYYY')
      ],
    );
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
