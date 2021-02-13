import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {PdfMakeWrapper, Table, Txt} from 'pdfmake-wrapper';
import { DeviceDetectorService } from 'ngx-device-detector';

import { Plaza } from '../../models/plaza.model';
import { PlazasService } from '../../services/plazas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-plazas',
  templateUrl: './plazas.component.html',
  styles: [
  ]
})

export class PlazasComponent implements OnInit {

  public usuarioLogin;

  public plazas: Plaza[] = [];

  // Paginador y filtrado
  public total = 0;
  public limit = 10;
  public desde = 0;
  public hasta = 10;
  public filtroActivos: any = '';
  public filtroDescripcion: any = '';
  
  // Loading
  public loading = true;

  // Reporte
  public plazasReporte: Plaza[] = [];
  public totalReporte = 0;
  
  constructor(
              private authService: AuthService,
              private plazasService: PlazasService,
              private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
    this.listarPlazas();
  }

  // Generar reporte
  generarReporte(): void{  
    this.plazasService.listarPlazas(0,0,true).subscribe( resp => {
      this.plazasReporte = resp.plazas;
      this.totalReporte = resp.total;
      this.reporte();
    });
  }

  // Reporte de las plazas en PDF
  reporte(): void {
      
    // Fecha de hoy
    const hoy = moment().format('DD/MM/YYYY');
    
    // Instancia de pdfMakeWrapper
    const pdf = new PdfMakeWrapper();
  
    pdf.info({
      title: `Plazas | ${hoy}`,
      author: 'GeoTasks - Plazas',
      subject: 'Reportes'
    });
    
    // Cabecera
    const header = new Txt(`MUNICIPALIDAD DE LA CIUDAD DE SAN LUIS`).alignment('center')
                                                                    .margin(20)
                                                                    .bold()
                                                                    .fontSize(13)
                                                                    .end;
    
    // Titulo
    const titulo = new Txt(`Reporte de plazas | Fecha de reporte - ${hoy}`).margin([0,30,0,0]).fontSize(11).end;

    // Subtitulo
    const subTitulo = new Txt(`PLAZAS TOTALES: ${this.totalReporte}`).bold().fontSize(11).margin([0,10,0,0]).end;

    // Tabla
    const plazas = this.extractData();
    const tabla = new Table([
      [new Txt('Nombre').bold().end, new Txt('Tipo').bold().end, new Txt('Ultima visita').bold().end],
      ...plazas
    ])
    .alignment('justify')
    .fontSize(10)
    .widths(['*', '*', 100])
    .margin([0,10,0,0])
    .layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex === 0 ? '#CCCCCC' : '';
      },    
    }).end;
    
    const isMobile = this.deviceService.isMobile();
    const isDesktop = this.deviceService.isDesktop();
    const isTablet = this.deviceService.isTablet();

    // GENERACION DEL REPORTE EN PDF
    // pdf.pageOrientation('landscape');
    pdf.header(header);  // Agrega cabecera
    pdf.add(titulo);     // Agrega titulo
    pdf.add(subTitulo);  // Agrega subtitulo
    pdf.add(tabla);      // Agrega Tabla
    
    if(isMobile || isTablet){
      pdf.create().download(); // Se genera PDF y se descarga    
    }else{
      pdf.create().open(); // Se genera PDF y se abre en otra pestaña  
    }

  }

  extractData(): any{
    return this.plazasReporte.map( plaza => [ plaza.descripcion, plaza.tipo['descripcion'] ,moment(plaza.fecha_ultima_visita).format('DD/MM/YYYY')] );
  }

  listarPlazas(): void{
    this.plazasService.listarPlazas(
      this.limit,
      this.desde,
      this.usuarioLogin.role == 'ADMIN_ROLE' ? this.filtroActivos : true,
      this.filtroDescripcion
    ).subscribe( resp => {
      this.loading = false;
      this.plazas = resp.plazas;
      this.plazasReporte = resp.plazas;
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
