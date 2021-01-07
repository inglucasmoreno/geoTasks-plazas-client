import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  public loginForm = this.fb.group({
    dni: ['', Validators.required],
    password: ['', Validators.required]
  });

  public loading = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {}

  login(): void {
    this.loading = true;
    if (this.loginForm.status === 'VALID'){
      this.authService.login(this.loginForm.value).subscribe( () => {
        this.loading = false;
        this.router.navigateByUrl('dashboard/home');
      }, ({error}) => {
        this.loading = false;
        this.loginForm.reset();
        let errorMsg;
        if (!error.msg){ errorMsg = 'No hay conexion con el servidor'; }
        else { errorMsg = error.msg; }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonText: 'Entendido',
        });
      });
    }else{
      this.loading = false;
      Swal.fire({
        icon: 'info',
        title: 'Información',
        text: 'Complete todos los campos',
        confirmButtonText: 'Entendido',
      });
    }
  }

}
