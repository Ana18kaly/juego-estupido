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
    this.authservice.history().subscribe({
        next: (response) => {
            console.log('Datos del historial:', response.data);
            this.historys = response.data;

            // Procesar los tiros y aciertos en el historial
            this.historys.forEach((game: any) => {
                console.log(`Partida ${game.id}`);
                game.tiros.forEach((shot: any) => {
                    console.log(`Jugador: ${shot.player}, Tiro ${shot.shot_number}: ${shot.is_correct}`);
                });
            });
        },
        error: (error) => {
            console.error('Error al obtener historial:', error);
            if (error.status == 401) {
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
