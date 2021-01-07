import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlazasService } from '../../services/plazas.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as L from 'leaflet';


@Component({
  selector: 'app-editar-plazas',
  templateUrl: './editar-plazas.component.html',
  styles: [
  ]
})
export class EditarPlazasComponent implements OnInit {

  public loading = true;

  public plaza = { 
    _id: '',
    descripcion: '',
    tareas: [],
    lat: '',
    lng: '' 
  };

  public map;
  public marker;
  public circle;
  public id;

  public plazaForm = this.fb.group({
    descripcion: ['', Validators.required]
  });

  constructor(private activatedRoute: ActivatedRoute,
              private plazasService: PlazasService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({ id }) => { 
      this.id = id; 
      this.plazasService.getPlaza(this.id).subscribe( plaza => {
        this.plaza = plaza;
        this.plazaForm.setValue({ descripcion: plaza.descripcion });
        this.crearMapa();
        this.actualizarMapa();
        this.loading = false;
      });
    });
  }
  
  getPlaza(): void {
    this.plazasService.getPlaza(this.id).subscribe( plaza => {
      this.plaza = plaza;
      this.plazaForm.setValue({ descripcion: plaza.descripcion });
      this.loading = false;
    });
  }

  actualizarPlaza(): void{
    if (this.plazaForm.status === 'VALID'){
      this.loading = true;
      this.plazasService.actualizarPlaza(this.plaza._id ,this.plazaForm.value).subscribe( () => {
        Swal.fire({
          icon: 'success',
          title: 'Completado',
          text: 'La plaza ha sido actualizada',
          showConfirmButton: false,
          timer: 1000
        });
        this.getPlaza();        
      });
    }else{
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'La descripción no puede estar vacía',
        confirmButtonText: 'Entendido'
      });
    }
  }

  crearMapa(): void {
      
    const centerLat = Number(this.plaza.lat);
    const centerLng = Number(this.plaza.lng);
    const zoomLevel = 17;

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
      
      Swal.fire({
        title: 'Estás seguro?',
        text: "Estas por cambiar la geolocalización de la plaza!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, actualizar',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          // Se borra el circulo y el marcador
          this.map.removeLayer(this.marker);
          this.map.removeLayer(this.circle);

          this.plaza.lat = e.latlng.lat;
          this.plaza.lng = e.latlng.lng;
          const data = {
            lat: e.latlng.lat.toString(),
            lng: e.latlng.lng.toString()
          }
          this.plazasService.actualizarPlaza(this.plaza._id, data).subscribe( () => {
            this.actualizarMapa();
            Swal.fire({
              icon: 'success',
              title: 'Completado',
              text: 'Geolocalización actualizada',
              showConfirmButton: false,
              timer: 1000  
            })
          });
        }
      })
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
    
      let icon;
      let colorCircle;
      
      // Color del icono y circulo segun la cantidad de tareas pendientes
      if(this.plaza.tareas.length === 0){
        icon = greenIcon;
        colorCircle = '#4fee48';
      }else if(this.plaza.tareas.length <= 2){
        icon = orangeIcon;
        colorCircle = '#edfc3d';
      }else{
        icon = redIcon;
        colorCircle = '#fd4646';
      }

      let circle = L.circle([Number(this.plaza.lat), Number(this.plaza.lng)],{
        color: colorCircle,
        fillColor: colorCircle,
        fillOpacity: 0.5,
        radius: 10
      });
      
      const marker = L.marker([Number(this.plaza.lat), Number(this.plaza.lng)], { icon });

      this.marker = marker;
      this.circle = circle;

      marker.addTo(this.map);
      circle.addTo(this.map);
       
  }

}
