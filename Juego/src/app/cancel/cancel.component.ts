import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { GameService } from '../core/services/game.service';
import Swal from 'sweetalert2';
import { Router} from '@angular/router';
import Pusher from 'pusher-js';
import Echo from 'laravel-echo';


  @Component({
    selector: 'app-cancel',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './cancel.component.html',
    styleUrls: ['./cancel.component.css'],
  })

  export class CancelComponent {
    echo: Echo
    constructor(private gameservice: GameService, private router: Router){
      (window as any).Pusher = Pusher;
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: 'GoofNBCH',
        cluster: 'mt1',
        encrypted: true,
        wsHost: window.location.hostname,
        wsPort: 6001,
        disableStats: true,
        forceTLS: false,
      });
   
    }
      closewebsocket(){
        if(this.echo){
          this.echo.disconnect();
        }
      }
      terminar(){
        const id = localStorage.getItem('game');
        this.gameservice.cancel(id).subscribe(
          (response) =>{
            Swal.fire({
              title: "Partida cancelada",
              text: "oh, no",
              icon: "success"
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/home']);
                }
            });
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
      ngOnInit(): void {
        this.echo.channel('start-game').listen('.start-game-event', (e: any) => {
          const game = localStorage.getItem("game")
          if(e.gameId == game){
            Swal.fire({
              title: "Partida iniciada!",
              text: "Preparate",
              icon: "success"
              });
              this.router.navigate(['/game']);
          }
        });
      }
      ngOnDestroy(): void {
          this.closewebsocket();
      }
      onDisconnect(): void {
        this.closewebsocket();
        this.terminar();
      }
  }
