import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {
  transform(fecha: Date): string {
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
    
    return `${dia}/${mes}/${date.getFullYear()} | ${hora}:${minutos} hs`;
  }
}
