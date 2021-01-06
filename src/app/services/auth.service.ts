import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

import { Usuario } from '../models/usuario.model';
import { LoginForm } from '../interfaces/login-form.interface';

const baseUrl = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Informacion de usuario logueado
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router
  ) { }

  // Iniciar Sesión
  login(data: LoginForm): Observable<any>{
    return this.http.post(`${baseUrl}/auth`, data)
                    .pipe(
                      tap( ({token}) => {
                        localStorage.setItem('token', token);
                      })
                    );
  }

  // Cerrar Sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }

  // Validar token
  validarToken(): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/auth`, {
      headers: { 'x-token': token }
    }).pipe(
      map( (resp: any) => {
        const {dni, apellido, nombre, email, role, uid, activo} = resp.usuario;
        this.usuario = new Usuario(uid, dni, apellido, nombre, email, role, activo);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false)) // el of permite devolver un observable<boolean>(false)
    );
  }

  // Proteccion de login
  proteccionLogin(): Observable<any>{
    const token = localStorage.getItem('token');
    return this.http.get(`${baseUrl}/auth`, {
      headers: { 'x-token': token }
    }).pipe(
      map(()=>{
        return false;
      }),
      catchError( error => of(true) )
      );
  }

}
