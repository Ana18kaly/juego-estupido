import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../core/services/auth.service';
import { Router} from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-verfication',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, LoginComponent],
  templateUrl: './verfication.component.html',
  styleUrl: './verfication.component.css'
})
export class VerficationComponent {
  enablebutton: boolean = true
  res:any = {}
singupForm= new FormGroup({
  code: new FormControl("", [Validators.required, Validators.max(6)])
})


constructor(private authservice: AuthService, private fb: FormBuilder, private router: Router){}

onSubmit(){
  this.enablebutton = false
  const isformSubmitted = this.singupForm.valid;
  const userData = {
    code: this.singupForm.value.code, 
    email: localStorage.getItem('email')
  };
  if(isformSubmitted){
    this.authservice.login(userData).subscribe(
      (response) => {          
        this.res = response.data
        localStorage.removeItem('email')
        localStorage.setItem('token', this.res.token)
        console.log(this.res.token)
        localStorage.setItem('user', JSON.stringify(this.res.user))
        this.enablebutton = true
        Swal.fire({
          title: "Datos correctos!",
          text: "Bienvenido!!!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          allowOutsideClick: true
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.backdrop) {
            this.router.navigate(['/home']);
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
  }else{
    this.enablebutton = true
    Swal.fire({
      title: "Datos incorrectos!",
      text: "El código debe ser de 6 de largo",
      icon: "info"
      })
  }
}
regresar(){
  localStorage.removeItem('email')
  this.router.navigate(['/login']);
}
}
