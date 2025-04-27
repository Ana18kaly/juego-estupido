import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { Router} from '@angular/router';
import Swal from 'sweetalert2';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  historys: any[] = [];
  echo: Echo

  constructor(private authservice: AuthService, private router: Router){
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

  ngOnInit(): void {
    // Primero obtenemos el historial
    this.authservice.history().subscribe({
      next: (response) => {
        console.log('Datos del historial:', response.data);
        this.historys = response.data.map((item: any) => {
          // Calcular tiros y aciertos para cada jugador
          const tirosJugador1 = item.tiros.filter((tiro: any) => tiro.player === item.jugador1);
          const tirosJugador2 = item.tiros.filter((tiro: any) => tiro.player === item.jugador2);
          
          return {
            ...item,
            tiros_jugador1: tirosJugador1.length,
            tiros_jugador2: tirosJugador2.length,
            aciertos_jugador1: tirosJugador1.filter((tiro: any) => tiro.is_correct === 'Acierto').length,
            aciertos_jugador2: tirosJugador2.filter((tiro: any) => tiro.is_correct === 'Acierto').length,
            total_tiros: item.tiros.length,
            total_aciertos: item.tiros.filter((tiro: any) => tiro.is_correct === 'Acierto').length
          };
        });
      },
      error: (error) => {
        console.error('Error al obtener historial:', error);
        if(error.status == 401){
          this.router.navigate(['/login']);
        }
        Swal.fire({
          title: 'Aviso',
          text: error.error?.msg || 'Error al cargar el historial',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
      }
    });

    // Manejo del websocket con mejor control de errores
    try {
      this.echo.channel('history-game')
        .listen('.history-game-event', (e: any) => {
          console.log('Nuevo evento de historial:', e);
          if (e.hostorial) {
            const newHistory = {
              ...e.hostorial,
              user_1: e.hostorial.user_1?.name || e.hostorial.user_1,
              user_2: e.hostorial.user_2?.name || e.hostorial.user_2
            };
            this.historys.push(newHistory);
          }
        });
    } catch (error) {
      console.error('Error en la conexión websocket:', error);
    }
  }

  // Instead of directly using window
  private getWindow(): any {
    return typeof window !== 'undefined' ? window : null;
  }

  // Then use this.getWindow() instead of window directly
  // For example:
  goBack() {
    const win = this.getWindow();
    if (win) {
      win.history.back();
    }
  }
}