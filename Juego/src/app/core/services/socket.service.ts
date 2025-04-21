import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  // constructor(private http:HttpClient) {
    
  // }

  // juego(){
  //   this.echo.channel('start-game').listen('.start-game-event',(data:any)=>{
  //     console.log(this.echo)
  //     console.log(data)
  //   })
  // }

  // unirse(){
  
  // }

  // getEcho(){
  //   return this.echo
  // }

  // deconectar(){
  //   if(this.echo){
  //     this.echo.disconnect()
  //   }
  // }
}
