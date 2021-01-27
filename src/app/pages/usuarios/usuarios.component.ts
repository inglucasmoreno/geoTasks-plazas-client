import { Component, OnInit } from '@angular/core';
import { PdfMakeWrapper, Txt, Table } from 'pdfmake-wrapper';
import { DeviceDetectorService } from 'ngx-device-detector';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  public usuarios: Usuario[];
  public total = 0;
  public limit = 10;
  public desde = 0;
  public hasta = 10;
  public filtroActivo = '';
  public filtroDni = '';
  public loading = true;

  // Para reportes
  public totalReporte = 0;
  public usuariosReporte = [];

  constructor(private usuariosService: UsuariosService,
              private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios(): void {
    this.usuariosService.listarUsuarios(this.limit, this.desde, this.filtroActivo, this.filtroDni).subscribe( resp => {
      const { usuarios, total } = resp;
      this.usuarios = usuarios;
      this.total = total;
      this.loading = false;
    }, (({error}) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.msg,
        confirmButtonText: 'Entendido'
      });
    }));
  }

  actualizarEstado(usuario: Usuario): void {
    const { uid, activo } = usuario;
    Swal.fire({
      title: '¿Estas seguro?',
      text: `¿Quieres actualizar el estado de ${usuario.nombre}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;  
        this.usuariosService.actualizarUsuario(uid, {activo: !activo}).subscribe(resp => {
          this.listarUsuarios();
          Swal.fire({
            icon: 'success',
            title: 'Completado',
            text: `Has actualizado el estado de ${usuario.nombre}`,
            showConfirmButton: false,
            timer: 1000
          });
        }, ({error}) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
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

    this.listarUsuarios();

  }

  filtrarActivos(activo: any): void{
    this.loading = true;
    this.filtroActivo = activo;
    this.listarUsuarios();
  }

  filtrarDni(dni: string): void{
    this.loading = true;
    this.filtroDni = dni;
    this.listarUsuarios();
  }


  generarReporte(){
    this.usuariosService.listarUsuarios(0,0,true).subscribe( resp => {
      this.totalReporte = resp.total;
      this.usuariosReporte = resp.usuarios; 
      this.reporte();
    });
  }

  reporte(): void{
    
    // Fecha de hoy
    const hoy = moment().format('DD/MM/YYYY');

    // Instancia de pdfMakeWrapper
    const pdf = new PdfMakeWrapper();
  
    pdf.info({
      title: `Usuarios | ${hoy}`,
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
    const titulo = new Txt(`Reporte de usuarios | Fecha de reporte - ${hoy}`).margin([0,30,0,0]).fontSize(11).end;

    // Subtitulo
    const subTitulo = new Txt(`USUARIOS TOTALES: ${this.totalReporte}`).bold().fontSize(11).margin([0,10,0,0]).end;                                                                

    const isMobile = this.deviceService.isMobile();
    const isDesktop = this.deviceService.isDesktop();
    const isTablet = this.deviceService.isTablet();
    
    // Tabla
    const usuarios = this.extractData();
    const tabla = new Table([
      [
        new Txt(`Apellido`).bold().end, 
        new Txt('Nombre').bold().end,
        new Txt('DNI').bold().end,
        new Txt('Rol').bold().end,
      ],
      ...usuarios
    ])
    .alignment('justify')
    .fontSize(10)
    .widths('*')
    .margin([0,10,0,0])
    .layout({
      fillColor: (rowIndex: number, node: any, columnIndex: number) => {
        return rowIndex === 0 ? '#CCCCCC' : '';
      },    
    }).end;

    // GENERACION DEL REPORTE EN PDF
    // pdf.pageOrientation('landscape');
    pdf.header(header);  // Agrega cabecera
    pdf.add(titulo);     // Agrega titulo
    pdf.add(subTitulo);  // Agrega subtitulo
    pdf.add(tabla);

    if(isMobile || isTablet){
      pdf.create().download(); // Se genera PDF y se descarga    
    }else{
      pdf.create().open(); // Se genera PDF y se abre en otra pestaña  
    }

  }

  extractData(): any{
    return this.usuariosReporte.map( usuario => 
      [usuario.apellido, usuario.nombre, usuario.dni, usuario.role === 'ADMIN_ROLE' ? 'Admin' : 'Estandar']);
  }

}