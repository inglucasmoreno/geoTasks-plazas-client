import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlazasService } from '../../services/plazas.service';

@Component({
  selector: 'app-tareas-plazas',
  templateUrl: './tareas-plazas.component.html',
  styles: [
  ]
})
export class TareasPlazasComponent implements OnInit {

  public plaza;

  constructor(private activatedRoute: ActivatedRoute,
              private plazasService: PlazasService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({id}) => {
      this.plazasService.getPlaza(id).subscribe( plaza => {
        this.plaza = plaza;
        console.log(this.plaza)
      })
    });
  }

}
