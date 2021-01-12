import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {
  transform(fecha: Date, tipo: 'mostrar'|'comparar'): string {

    // Mostrar: Ajuste de formato para muestra por pantalla
    if(tipo === 'mostrar'){
      return moment(fecha).format('DD/MM/YYYY');
    }

    // Comparar: Comparacion para manejar estilos
    if (tipo === 'comparar'){
      const fechaLimite = moment(fecha).format('YYYY-MM-DD');
      const fechaHoy = moment().format('YYYY-MM-DD');
      const diff = moment(fechaLimite).diff(moment(fechaHoy), 'days');
      if (diff === 0){
        return 'PorVencer';
      } else if (diff < 0){
          return 'Vencida';
      } else{
        return 'Bien';
      }
    }

  }
}
