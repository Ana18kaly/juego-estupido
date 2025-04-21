import { Injectable } from "@angular/core";
import { Route } from "@angular/router";
import { rejects } from "assert";
import { resolve } from "path";
import  Pusher  from "pusher-js"
import Echo from "laravel-echo"

@Injectable()
export class WebsocketService {
  pusher:any
  channel: any
  constructor() {
    this.pusher = new Pusher('GoofNBCH', {cluster:'mt1'});
    this.channel = this.pusher.subscribe('private-start-game')
  }

  listen(eventName: string){
    return new Promise((resolve, reject) => {
      this.channel.bind(eventName,(data:any) => {
        resolve(data);
      })
    })
  }
  
}
