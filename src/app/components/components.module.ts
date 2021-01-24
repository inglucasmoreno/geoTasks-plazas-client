import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonHomeComponent } from './boton-home/boton-home.component';
import { BotonTablaComponent } from './boton-tabla/boton-tabla.component';
import { BotonEstadoComponent } from './boton-estado/boton-estado.component';
import { BotonVolverComponent } from './boton-volver/boton-volver.component';
import { BotonImprimirComponent } from './boton-imprimir/boton-imprimir.component';
import { PastillaComponent } from './pastilla/pastilla.component';
import { BotonRealizarComponent } from './boton-realizar/boton-realizar.component';
import { TarjetaComponent } from './tarjeta/tarjeta.component';

@NgModule({
  declarations: [
    BotonHomeComponent,
    BotonTablaComponent,
    BotonEstadoComponent,
    BotonVolverComponent,
    BotonImprimirComponent,
    PastillaComponent,
    BotonRealizarComponent,
    TarjetaComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BotonHomeComponent,
    BotonTablaComponent,
    BotonEstadoComponent,
    BotonVolverComponent,
    BotonImprimirComponent,
    PastillaComponent,
    BotonRealizarComponent,
    TarjetaComponent,
  ]
})
export class ComponentsModule { }
