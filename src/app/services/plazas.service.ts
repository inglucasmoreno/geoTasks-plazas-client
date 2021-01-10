import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plaza } from '../models/plaza.model';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PlazasService {

  constructor(private http: HttpClient) { }

  // Get plaza
  getPlaza(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/plazas/${id}`, {headers: {'x-token': token}});
  }

  // Listar plazas
  listarPlazas(limit = 0, desde = 0, activo = null, descripcion = ''): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/plazas`, {
      params: {
        desde: String(desde),
        limit: String(limit),
        activo,
        descripcion
      },
      headers: {'x-token': token}
    });
  }

  // Nueva plaza
  nuevaPlaza(data: Plaza): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.post(`${baseUrl}/plazas`, data, {headers: {'x-token': token}});
  }

  // Actualizar plaza
  actualizarPlaza(id: string, data: object ): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.put(`${baseUrl}/plazas/${id}`, data, {headers: {'x-token': token}});
  }

}
