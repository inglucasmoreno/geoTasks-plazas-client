import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {
  transform(fecha: Date, tipo: 'mostrar'|'comparar'): string {

    // Mostrar: Ajuste de formato para muestra por pantalla
    if (tipo === 'mostrar'){
      const date = new Date(fecha);

      let dia;
      let mes;
      let hora;
      let minutos;

      // Dia
      if (date.getDate() < 10){
        dia = `0${date.getDate()}`;
      }
      else {
        dia = date.getDate();
      }

      // Mes
      if (date.getMonth() + 1 < 10){
        mes = `0${date.getMonth() + 1}`;
      }
      else {
        mes = date.getMonth() + 1;
      }

      // Hora
      if (date.getHours() < 10){
        hora = `0${date.getHours()}`;
      }
      else {
        hora = date.getHours();
      }

      // Minutos
      if (date.getMinutes() < 10){
        minutos = `0${date.getMinutes()}`;
      }
      else {
        minutos = date.getMinutes();
      }

      return `${dia}/${mes}/${date.getFullYear()}`;
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
