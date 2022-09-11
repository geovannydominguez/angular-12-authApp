import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  miFormulario: FormGroup = this.fb.group({
    name: ['Test4', [Validators.required]],
    email: ['tes4@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  registro() {

    const { name, email, password } = this.miFormulario.value;

    this.authService.registro(name, email, password)
      .subscribe(resp => {

        // Pregunto explícitamente si es igual a true, porque si solo dejo como 'if (resp)',
        // podría entrar de todas formas porque el resp de hecho contiena algún valor como respuesta.
        if (resp == true) { 
          this.router.navigateByUrl('/dashboard');
        } else {
          Swal.fire('Error', resp, 'error');
        }
      });


  }

}
