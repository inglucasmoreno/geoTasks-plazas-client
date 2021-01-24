import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-boton-imprimir',
  templateUrl: './boton-imprimir.component.html',
  styles: [
  ]
})
export class BotonImprimirComponent implements OnInit {

  @Input() titulo: string;
  @Output() reporte = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

}
