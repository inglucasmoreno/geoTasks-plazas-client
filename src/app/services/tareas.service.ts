import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  public showAlert = false;

  constructor(private http: HttpClient) { }
  
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  // Listar tareas por plaza
  tareasPlaza(idPlaza: string, desde = 0, hasta = 0): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/tareas/listar/plaza/${idPlaza}`, {
      headers: {'x-token': token},
      params: {
        activo: 'false',
        desde: String(desde),
        hasta: String(hasta)
      }
    });  
  }

  // Tarea por ID
  getTarea(idTarea: string): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/tareas/${idTarea}`,{headers:{'x-token': token}})
                    .pipe( map( (resp: any) => resp.tarea ) );
  }

  // Nueva tarea
  nuevaTarea(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${baseUrl}/tareas`, data, { headers:{
      'x-token': token
    }});  
  }
  
  // Listar tareas
  listarTarea(plaza = '', activo = null): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/tareas`,{ 
      params:{ plaza, activo },
      headers: 
      {
        'x-token': token
      }});
  }

  // Listar tareas vencidas
  listarVencidas(
    desdeTareas = 0, 
    hastaTareas = 0, 
    desdePorVencer = 0,
    hastaPorVencer= 0,
    desdeVencidas = 0,
    hastaVencidas = 0,
    descripcionPorVencer = '',
    descripcionVencidas = ''
    ): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/tareas/listar/vencidas`, 
    {
      params:{
        desdeTareas: String(desdeTareas),
        hastaTareas: String(hastaTareas),
        desdeVencidas: String(desdeVencidas),
        hastaVencidas: String(hastaVencidas),
        desdePorVencer: String(desdePorVencer),
        hastaPorVencer: String(hastaPorVencer),
        descripcionPorVencer,
        descripcionVencidas
      },
      headers:{'x-token': token}
    }).pipe(
      tap(({totalTareas}) => {
        if(totalTareas > 0) this.showAlert = true;
        else this.showAlert = false;
        this.change.emit(this.showAlert);
      })
    )
  }

  // Actualizar tarea
  actualizarTarea(idTarea: string, data: any): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.put(`${baseUrl}/tareas/${idTarea}`, data, {headers:{'x-token': token}});
  }

  // Actualizar alerta
  actualizarAlerta(): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/tareas/listar/vencidas`, {headers: {'x-token': token}})
                    .pipe(
                      tap(({totalTareas}) => {
                        if(totalTareas > 0) this.showAlert = true;
                        else this.showAlert = false;
                        this.change.emit(this.showAlert);
                      })
                    )
  }

}
