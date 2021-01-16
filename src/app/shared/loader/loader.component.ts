import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  public show = false;

  constructor(private router: Router,
              private tareasService: TareasService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart){
        this.show = true;

        // Se actualiza el icono de alertas
        this.tareasService.actualizarAlerta().subscribe();

      }else if(event instanceof NavigationEnd){
          setTimeout(()=>{
            this.show = false;      
          }, 500)
      }
    });
  }

}
