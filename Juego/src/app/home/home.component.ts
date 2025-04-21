import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GameService } from '../core/services/game.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router'; // Añadir esta importación
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { response } from 'express';
import Swal from 'sweetalert2';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule // Añadir este import
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  enablebuttonLogout: boolean = true;
  enablebuttonUnirse: boolean = true;
  games: any[] = [];
  echo: Echo | null = null;

  constructor(
    private gameservice: GameService, 
    private authservice: AuthService, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    if (isPlatformBrowser(this.platformId)) {
      (window as any).Pusher = Pusher;
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: 'GoofNBCH',
        cluster: 'mt1',
        encrypted: false,
        wsHost: '127.0.0.1',
        wsPort: 6001,        // Cambiado a 6001
        forceTLS: false,
        enabledTransports: ['ws'],
        disableStats: true,
        namespace: ''        // Agregado namespace vacío
      });
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gameservice.cancelAll().subscribe(
        (response) => {
          console.log(response)
        }
      );
      
      this.gameservice.search().subscribe(
        (response) =>{
          this.games = response.data
        },
        (error) => {
          if(error.status == 401){
            this.router.navigate(['/login']);
          }
          Swal.fire({
            title: 'Aviso',
            text: error.error.msg,
            icon: 'info',
            confirmButtonText: 'Aceptar'
          });
        }
      )

      if (this.echo) {
        this.echo.channel('games-game').listen('.games-event', (e: any) => {
          let user = JSON.parse(localStorage.getItem('user') || '{}');
          let userId = user.id;
          if (e.games.user_1 !== userId) {
            const id = localStorage.getItem('game');
            this.authservice.userName(id).subscribe(
              (response) =>{
                e.games.user_1 = response.data.name
              },
              (error) => {
              e.games.user_1 = "Nombre no encontrado"
                if(error.status == 401){
                  this.router.navigate(['/login']);Swal.fire({
                    title: 'Aviso',
                    text: error.error.msg,
                    icon: 'info',
                    confirmButtonText: 'Aceptar'
                  });
                }
                
              }
            )
            this.games.push(e.games)
          }
        });
      }
    }
  }
  unirse(id:Number): void{
    this.enablebuttonUnirse = false
    localStorage.setItem('game', id.toString());
    this.gameservice.start(id).subscribe(
      (response) =>{
        this.enablebuttonUnirse = true
        Swal.fire({
          title: 'Partida iniciada',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.router.navigate(['/game']);
      },
      (error) => {
        this.enablebuttonUnirse = true
        if(error.status == 401){
          this.router.navigate(['/login']);
        }
        Swal.fire({
          title: 'Error',
          text: error.error.msg,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    )
  }
  newGame(): void {  
      this.gameservice.create().subscribe(
        (response) =>{
          localStorage.setItem('game', response.data.id)
          Swal.fire({
            title: "Partida creada!",
            text: "Espere a que un jugador entre",
            icon: "success"
            });
            this.router.navigate(['/cancel']);
        },
        (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error.msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        })
  }

  history(): void {  
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/history']); // Simplificar la navegación
    }
  }

  logout(): void {  
    if (isPlatformBrowser(this.platformId)) {
      console.log("Bye");
      this.enablebuttonLogout = false;
      this.authservice.logout().subscribe(
        (response) => {
          localStorage.removeItem("token");
          this.enablebuttonLogout = true;
          Swal.fire({
            title: "Cuenta cerrada!",
            text: "Bye :(",
            icon: "success"
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
        },
        (error) => {
          this.enablebuttonLogout = true;
          Swal.fire({
            title: 'Error',
            text: error.error.msg,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      );
    }
  }
}
