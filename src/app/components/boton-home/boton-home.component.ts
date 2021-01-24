import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boton-home',
  templateUrl: './boton-home.component.html',
  styles: [
  ]
})
export class BotonHomeComponent implements OnInit {

  // Propiedades de entrada
  @Input() icono: string;
  @Input() titulo: string;
  @Input() ruta: string;
  @Input() borde: string = 'border-green-500';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navegar(): void {
    this.router.navigateByUrl(this.ruta);
  }

}
