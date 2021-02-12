import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TiposService {
  constructor(private http: HttpClient) {}

  // Listar tipos
  listarTipos(): Observable<any>{
    return this.http.get(`${baseUrl}/tipos`, {headers: {
      'x-token': localStorage.getItem('token')  
    }})
  }

}
