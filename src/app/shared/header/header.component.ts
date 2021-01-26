import { Component, OnInit } from '@angular/core';
import { TareasService } from 'src/app/services/tareas.service';
import { AuthService } from '../../services/auth.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public showMenu = true;
  public showAlert = false;
  public usuarioLogin;

  constructor(private tareasService: TareasService,
              private authService: AuthService,) { }

  ngOnInit(): void {
    this.usuarioLogin = this.authService.usuario;
    this.tareasService.change.subscribe( showAlert => { this.showAlert = showAlert; });
    this.mostrarAlertas();
  }

  mostrarAlertas(): void {
    this.tareasService.listarVencidas().subscribe(resp =>{
      if(resp.totalTareas > 0){
        this.showAlert = true;
      }else{
        this.showAlert = false;
      }
    });
  }

  logout(): void{
    this.authService.logout();
  }

  toggleMenu(): void{
    this.showMenu ? this.showMenu = false : this.showMenu = true;
  }

}