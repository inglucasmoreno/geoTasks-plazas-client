import { Component, OnInit } from '@angular/core';
import { TareasService } from 'src/app/services/tareas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public showMenu = true;
  public showAlert = false;

  constructor(private tareasService: TareasService,
              private authService: AuthService,) { }

  ngOnInit(): void {
    this.tareasService.change.subscribe( isOpen => { this.showAlert = isOpen; });
    this.mostrarAlertas();
  }

  mostrarAlertas(): void {
    this.tareasService.listarVencidas().subscribe(resp =>{
      console.log(resp);
      if(resp.totalTareas > 0){
        this.showAlert = true;
      }else{
        this.showAlert = false;
      }
      console.log(this.showAlert);
    });
  }

  logout(): void{
    this.authService.logout();
  }

  toggleMenu(): void{
    this.showMenu ? this.showMenu = false : this.showMenu = true;
  }

}