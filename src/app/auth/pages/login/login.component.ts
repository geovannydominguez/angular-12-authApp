import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    email: ['tes1@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, 
              private router: Router, 
              private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    console.log(this.miFormulario.value);
    console.log(this.miFormulario.valid);

    const {email, password} = this.miFormulario.value;

    this.authService.login(email, password)
      .subscribe( resp => {
        
        if (resp === true) {
          this.router.navigateByUrl('/dashboard');
        } else {
          Swal.fire('Error', resp, 'error');
        }
      });
    //this.router.navigateByUrl('/dashboard');
  }
}
