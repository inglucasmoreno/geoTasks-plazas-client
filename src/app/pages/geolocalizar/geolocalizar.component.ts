import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import * as moment from 'moment';

import { PlazasService } from '../../services/plazas.service';
import { TareasService } from '../../services/tareas.service';
import { AuthService } from '../../services/auth.service';
import { TiposService } from 'src/app/services/tipos.service';

@Component({
  selector: 'app-geolocalizar',
  templateUrl: './geolocalizar.component.html',
  styleUrls: ['./geolocalizar.component.css']
})
export class GeolocalizarComponent implements OnInit {

  public usuarioLogin;
  public tipos = {};
  public map;
  public marcadores = [];
  public loading = true;

  constructor(private authService: AuthService,
              private plazasService: PlazasService,
              private tareasService: TareasService,
              private tiposServices: TiposService) { }
  
  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario; 
    this.crearMapa();
    this.actualizarMapa();
    this.listarTipos();
  }

  listarTipos(): void {
    this.tiposServices.listarTipos().subscribe( resp => {
      resp.tipos.map( ({_id, descripcion}) => {
        this.tipos[_id] = descripcion;
      }); 
      console.log(this.tipos);
    });
  }

  crearMapa(): void {
    
    const centerLat = -33.30212579145777;
    const centerLng = -66.33692121054584;
    const zoomLevel = 14;

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 14,
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });  

    this.map = L.map('map', {
      center: [centerLat, centerLng],
      zoom: zoomLevel  
    });

    mainLayer.addTo(this.map);

    this.map.on('click', async (e) => {

      if(this.usuarioLogin.role === 'ADMIN_ROLE'){
        
        // Seleccion de tipo de elemento
        const { value: tipo } = await Swal.fire({
          title: 'Seleccionar tipo',
          input: 'select',
          inputOptions: this.tipos,
          showCancelButton: true,
          confirmButtonText: 'Seleccionar',
          cancelButtonText: 'Cancelar',
        })

        if(tipo){

          // Nombre del elemento
          const { value: nombre } = await Swal.fire({
            title: `Ingresar nombre`,
            input: 'text',
            inputPlaceholder: 'Nombre',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Crear'
          })
        
          // Si tiene un tipo y un nombre se crea el nuevo elemento
          if(tipo && nombre){
            Swal.fire({
              icon: 'success',
              title: 'Completado',
              text: `Elemento creado correctamente`,
              confirmButtonText: 'Entendido'
            });

          const data = {
            descripcion: nombre,
            lat: e.latlng.lat.toString(),
            lng: e.latlng.lng.toString(),
            tipo              
          }

          this.plazasService.nuevaPlaza(data).subscribe( () => {
            Swal.fire({
              title: 'Completado',
              text: `Elemento creado correctamente`,
              showConfirmButton: false,
              icon: 'success',
              timer: 1000
            })
            this.actualizarMapa();
          });
        }
      }
      
      }

    }
       
  )}

  actualizarMapa(): void {
  
    this.loading = true;

    var greenIcon = L.icon({
      iconUrl: 'assets/leaf-green.png',
      shadowUrl: 'assets/leaf-shadow.png',
  
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var orangeIcon = L.icon({
      iconUrl: 'assets/leaf-orange.png',
      shadowUrl: 'assets/leaf-shadow.png',
  
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    var redIcon = L.icon({
      iconUrl: 'assets/leaf-red.png',
      shadowUrl: 'assets/leaf-shadow.png',
  
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    
    this.plazasService.listarPlazas(0, 0, true).subscribe( resp => {
       
      this.loading = false;
      
      let totalVencidas = 0;
      let totalPorVencer = 0;
      let totalPendientes = 0;

      let icon = greenIcon;
      let colorCircle;
      
      this.marcadores = resp.plazas;
      this.marcadores.forEach((m: any) => {
        this.tareasService.listarTarea(m._id, true).subscribe(resp => {
          totalPendientes = resp.totalTareas;
          totalVencidas = resp.totalVencidas; 
          totalPorVencer = resp.totalPorVencer; 

          colorCircle = '#4fee48';
    
          // Color del icono y circulo segun la cantidad de tareas pendientes
          if(totalVencidas > 0){
            icon = redIcon;
            colorCircle = '#fd4646';
          }else if(totalPorVencer > 0){
            icon = orangeIcon;
            colorCircle = '#edfc3d';
          }else{
            icon = greenIcon;
            colorCircle = '#4fee48';
          }
    
          let circle = L.circle([m.lat, m.lng],{
            color: colorCircle,
            fillColor: colorCircle,
            fillOpacity: 0.5,
            radius: 20
          });
          
          const marker = L.marker([Number(m.lat), Number(m.lng)], { icon }).bindPopup(`
          <div class="border rounded shadow">
            <h1 class="font-semibold bg-green-500 text-white py-2 px-4"> 
            <i class="fas fa-tree mr-1"></i>
              ${m.descripcion} 
            </h1>
            <h1 class="font-semibold bg-gray-500 text-white p-1"> 
              Ultima visita 
            </h1>
            <div class="border-l-8 border-blue-500 p-1">
              <span class="font-semibold text-gray-600"> ${ moment(m.fecha_ultima_visita).format('DD/MM/YYYY') } </span>
            </div>  
            <h1 class="font-semibold bg-gray-500 text-white p-1"> 
              Tareas (${totalPendientes}) 
            </h1>  
            <div class="flex px-1 items-center justify-between border-l-8 border-green-500 font-semibold">
              <h1> No vencidas </h1>
              <span class="p-1"> ${totalPendientes - (totalPorVencer + totalVencidas)} </span>
            </div>
            <div class="flex px-1 items-center justify-between border-l-8 border-yellow-500 font-semibold">
              <h1> Por vencer </h1>
              <span class="p-1"> ${totalPorVencer} </span>
            </div>
            <div class="flex px-1 items-center justify-between border-l-8 border-red-500 font-semibold">
              <h1> Vencidas </h1>
              <span class="p-1"> ${totalVencidas} </span>
            </div>
            </div>
            <button onclick="location.href='dashboard/plazas/tareas/${m._id}'" routerLink="dashboard/plazas" class="text-white bg-green-500 p-2 shadow rounded w-full mt-2"> Ir a plaza </button>     
          `);
          marker.addTo(this.map);
          circle.addTo(this.map);
        
        });
      });
    });   
  }
}
