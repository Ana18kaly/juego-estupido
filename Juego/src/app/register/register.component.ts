import { Component, Input } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { response } from 'express';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  enablebutton: boolean = true
  singupForm= new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    email: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}'), Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  })

  constructor(private authservice: AuthService, private fb: FormBuilder, private router: Router){}

  login(){
    this.router.navigate(['/login']);
  }
  onSubmit(){
    this.enablebutton = false
    const isformSubmitted = this.singupForm.valid;
    const userData = this.singupForm.value;

    if(isformSubmitted){
      this.authservice.register(userData).subscribe(
        (response) => {
          this.enablebutton = true
          Swal.fire({
            title: "Registrado!",
            text: "Sa ha enviado un correo para verificar tu cuenta",
            icon: "success"
            });
          this.router.navigate(['/login']);
        },
        (error) => {
          this.enablebutton = true
          Swal.fire({
            title: 'Error',
            text: error.error.msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        })
    }
  }
}
