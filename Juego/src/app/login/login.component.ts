import { Component, Input } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { response } from 'express';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  enablebutton: boolean = true
  email: string = ""
  singupForm= new FormGroup({
    email: new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}'), Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  })

  constructor(private authservice: AuthService, private fb: FormBuilder, private router: Router){}

  register(){
    this.router.navigate(['/register']);
  }
  onSubmit(){
    this.enablebutton = false
    const isformSubmitted = this.singupForm.valid;
    const userData = this.singupForm.value;
    if(isformSubmitted){
      this.authservice.code(userData).subscribe(
        (response) => {
          this.enablebutton = true        
          this.email = this.singupForm.value.email!
          localStorage.setItem('email', this.email)
          Swal.fire({
            title: "Datos correctos!",
            text: "Se ha enviado un código a su correo",
            icon: "success"
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/verfication']);
              }
          });
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
