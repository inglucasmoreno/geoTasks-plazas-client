import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  public showMenu = true;

  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout(): void{
    this.authService.logout();
  }

  toggleMenu(): void{
    this.showMenu ? this.showMenu = false : this.showMenu = true;
  }

}