import { createInjectable } from '@angular/compiler/src/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { PlazasService } from '../../services/plazas.service';

@Component({
  selector: 'app-geolocalizar',
  templateUrl: './geolocalizar.component.html'
})
export class GeolocalizarComponent implements AfterViewInit {

  map;

  public marcadores = [];

  constructor(private plazasService: PlazasService) { }
  
  ngAfterViewInit(): void {
    this.crearMapa();
    this.actualizarMapa();
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
        
      const { value: plaza } = await Swal.fire({
        title: 'Insertando plaza',
        confirmButtonText: 'Crear nueva plaza',
        input: 'text',
        inputLabel: 'Ingrese descripción',
        inputPlaceholder: 'Nombre de la plaza',
      });
      
      if(plaza){
        
        const data = {
          descripcion: plaza,
          lat: e.latlng.lat.toString(),
          lng: e.latlng.lng.toString()
        }
      
        this.plazasService.nuevaPlaza(data).subscribe( () => {
          Swal.fire({
            title: 'Completado',
            text: `${plaza} ha sido creada`,
            showConfirmButton: false,
            icon: 'success',
            timer: 1000
          })
          this.actualizarMapa();
        });

        }
      });    
  }

  actualizarMapa(): void {

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
    
    this.plazasService.listarPlazas().subscribe( resp => {
      
      let icon;
      let colorCircle;
      
      this.marcadores = resp.plazas.filter( plazas => plazas.activo === true);
      this.marcadores.forEach((m: any) => {
      
      // Color del icono y circulo segun la cantidad de tareas pendientes
      if(m.tareas.length === 0){
        icon = greenIcon;
        colorCircle = '#4fee48';
      }else if(m.tareas.length <= 2){
        icon = orangeIcon;
        colorCircle = '#edfc3d';
      }else{
        icon = redIcon;
        colorCircle = '#fd4646';
      }

      let circle = L.circle([m.lat, m.lng],{
        color: colorCircle,
        fillColor: colorCircle,
        fillOpacity: 0.5,
        radius: 20
      });
      
      const marker = L.marker([Number(m.lat), Number(m.lng)], { icon }).bindPopup(`
      <div class="p-2">
        <b> Nombre </b><br>
        ${m.descripcion} <br><br>
        <b> Tareas pendientes </b><br>
        ${m.tareas.length} ${ m.tareas.length == 1 ? 'tarea' : 'tareas'} <br>
      </div>
      `);
      marker.addTo(this.map);
      circle.addTo(this.map);
      });
      
    });   
  }
}
