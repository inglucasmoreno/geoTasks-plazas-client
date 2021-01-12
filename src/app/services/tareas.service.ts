import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  constructor(private http: HttpClient) { }
  
  // Tarea por ID
  getTarea(idTarea): Observable<any>{
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
  listarVencidas(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/tareas/listar/vencidas`, {
      headers:{'x-token': token}
    });
  }

  // Actualizar tarea
  actualizarTarea(idTarea: string, data: any): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.put(`${baseUrl}/tareas/${idTarea}`, data, {headers:{'x-token': token}});
  }

}
